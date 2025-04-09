from rdflib import Graph, RDF, RDFS, OWL
from rdflib.term import BNode
import json

g = Graph()
g.parse("https://raw.githubusercontent.com/tibonto/dr/master/DigitalReference.ttl", format="turtle")
print(len(g))

OWL_NS = OWL
RDF_NS = RDF
RDFS_NS = RDFS

def extract_local_name(iri):
    name = iri.split("#")[-1] if "#" in iri else iri.split("/")[-1]
    return name.replace("_", " ")

lobe_order = [
    "Cloud_Lobe",
    "Organization_Lobe",
    "Planning_Lobe",
    "Power_Lobe",
    "Process_Lobe",
    "Product_Lobe",
    "Semiconductor_Development_Lobe",
    "Semiconductor_Production_Lobe",
    "Sensor_Lobe",
    "Supply_Chain_Lobe",
    "Sustainability_Lobe",
    "System_Lobe",
    "Time_Lobe",
    "Wired_Communication_Lobe"
]

def identify_lobes():
    lobes = {}
    for cls in g.subjects(predicate=RDF.type, object=OWL.Class):
        local_name = cls.split("#")[-1] if "#" in cls else cls.split("/")[-1]
        if local_name in lobe_order:
            lobes[local_name] = cls
    print(f"Identified lobes: {[key for key in lobes.keys()]}")
    return lobes

def find_lobe(cls, lobes, path=None):
    """
    Recursively traverse the hierarchy to find the top-level lobe for a given class.
    Detect and handle circular references to prevent infinite recursion.
    """
    if path is None:
        path = set()

    if cls in lobes.values():
        return cls

    if cls in path:
        print(f"Warning: Circular reference detected for class {cls}.")
        return None  

    path.add(cls)

    for parent in g.objects(subject=cls, predicate=RDFS.subClassOf):
        lobe = find_lobe(parent, lobes, path)
        if lobe:
            return lobe

    return None

def process_class(cls, visited):

    if isinstance(cls, BNode):
        return None

    if cls in visited:
        return None

    visited.add(cls)
    
    class_data = {
        
        "name": extract_local_name(cls),
        "iri": str(cls),
        "description": g.value(subject=cls, predicate=RDFS.comment) or "No description yet",
        "subclasses": [],
        "object_properties": [],
        "datatype_properties": [],
        "equivalent_classes": [],
        "disjoint_classes": []
    }

    
    subclasses = list(g.subjects(predicate=RDFS.subClassOf, object=cls))
    for subclass in subclasses:
        subclass_data = process_class(subclass, visited) 
        if subclass_data:
            class_data["subclasses"].append(subclass_data)

    
    for object_prop in g.subjects(predicate=RDF.type, object=OWL.ObjectProperty):
        domain = g.value(subject=object_prop, predicate=RDFS.domain)
        if domain == cls:
            class_data["object_properties"].append({"name": extract_local_name(object_prop), "iri": str(object_prop)})

    
    for datatype_prop in g.subjects(predicate=RDF.type, object=OWL.DatatypeProperty):
        domain = g.value(subject=datatype_prop, predicate=RDFS.domain)
        if domain == cls:
            class_data["datatype_properties"].append({"name": extract_local_name(datatype_prop), "iri": str(datatype_prop)})

    
    equivalent_classes = list(g.objects(subject=cls, predicate=OWL.equivalentClass))
    class_data["equivalent_classes"] = [{"name": extract_local_name(eq), "iri": str(eq)} for eq in equivalent_classes]
    
    disjoint_classes = list(g.objects(subject=cls, predicate=OWL.disjointWith))
    class_data["disjoint_classes"] = [{"name": extract_local_name(disjoint), "iri": str(disjoint)} for disjoint in disjoint_classes]

    return class_data


lobes = identify_lobes()
data = []
visited = set()

for cls in g.subjects(predicate=RDF.type, object=OWL.Class):
    lobe = find_lobe(cls, lobes)
    if not lobe:
        print(f"Warning: Class {cls} does not belong to any lobe.") # "Ghost classes"
        continue


    lobe_name = cls.split("#")[-1] if "#" in cls else cls.split("/")[-1]
    lobe_data = next((item for item in data if item["name"] == extract_local_name(lobe)), None)
    if not lobe_data:
        lobe_data = process_class(lobe, visited)
        if lobe_data:
            data.append(lobe_data)

    if cls != lobe:
        class_data = process_class(cls, visited)
        if class_data:
            lobe_data["subclasses"].append(class_data)

# Sort
data.sort(key=lambda lobe: lobe_order.index(lobe["name"].replace(" ", "_")))

output_file = "tree_structure.json"
with open(output_file, "w") as f:
    json.dump(data, f, indent=4)

print(f"Ontology data has been saved to {output_file}")