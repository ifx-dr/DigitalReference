fetch('lobes_classes.json')
    .then(response => response.json())
    .then(data => {
        renderOntology(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));

function renderOntology(data) {
    const container = document.getElementById('ontology-viewer');

    data.forEach(lobe => {
        const lobeDiv = document.createElement('div');
        lobeDiv.setAttribute('title', lobe.name.replace(/\s/g, '_'));

        const lobeAnchor = document.createElement('a');
        lobeAnchor.setAttribute('name', lobe.name.replace(/\s/g, '_'));
        lobeAnchor.classList.add('aLo');
        lobeDiv.appendChild(lobeAnchor);

        const lobeDl = document.createElement('dl');
        lobeDl.setAttribute('id', lobe.name.replace(/\s/g, ''));
        lobeDl.innerHTML = `
        <h3>${lobe.name} :</h3>
        <dl>
            <dt>IRI</dt>
            <dd><code>${lobe.iri}</code></dd>
            <dt>Super Class Of :</dt>
            <dd>
                <ul>
                    ${lobe.subclasses.map(subclass => `
                        <li>
                            <span>
                                <a href="#${subclass.iri}" title="${subclass.iri}">
                                    ${subclass.name}
                                </a>
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </dd>
            <dt>Description</dt>
            <p>${lobe.description}</p>
        </dl>
    `;
        lobeDiv.appendChild(lobeDl);

        lobe.subclasses.forEach(subclass => {
            const subclassHTML = renderSubclass(subclass, lobe.name, 1); 
            lobeDiv.innerHTML += subclassHTML;
        });

        container.appendChild(lobeDiv);
    });
}


function renderSubclass(subclass, parentLobe, depth = 1) {
    const depthClass = `depth-level-${depth}`;

    let html = `
    <div class="property entity ${depthClass}" id="${subclass.iri}">
        <h3>${subclass.name} :</h3>
        <table>
            <tbody>
            <tr>
                <th class="noblue">IRI</th>
                <td><code>${subclass.iri}</code></td>
            </tr>
            <tr>
                <th class="noblue">Description</th>
                <td>
                <p class="description">${subclass.description || "No description yet"}</p>
                </td>
            </tr>
    `;

    // subclasses
    if (subclass.subclasses && subclass.subclasses.length > 0) {
        html += `
            <tr>
                <th>has sub-classes</th>
                <td>
                <span class="inline-list">
                    ${subclass.subclasses.map(subSub => `
                    <a href="#${subSub.iri}" title="${subSub.iri}">${subSub.name}</a>
                    `).join('')}
                </span>
                </td>
            </tr>
        `;
    }

    // object properties
    if (subclass.object_properties && subclass.object_properties.length > 0) {
        html += `
            <tr>
                <th>has object properties</th>
                <td>
                <span class="inline-list">
                    ${subclass.object_properties.map(objProp => `
                    <a title="${objProp.iri}">${objProp.name}</a>
                    `).join('')}
                </span>
                </td>
            </tr>
        `;
    }

    // datatype properties
    if (subclass.datatype_properties && subclass.datatype_properties.length > 0) {
        html += `
            <tr>
                <th>has datatype properties</th>
                <td>
                <span class="inline-list">
                    ${subclass.datatype_properties.map(dtProp => `
                    <a title="${dtProp.iri}">${dtProp.name}</a>
                    `).join('')}
                </span>
                </td>
            </tr>
        `;
    }

    // equivalent classes
    if (subclass.equivalent_classes && subclass.equivalent_classes.length > 0) {
        html += `
            <tr>
                <th>is equivalent to</th>
                <td>
                <span class="inline-list">
                    ${subclass.equivalent_classes.map(eqClass => `
                    <a href="#${eqClass.iri}" title="${eqClass.iri}">${eqClass.name}</a>
                    `).join('')}
                </span>
                </td>
            </tr>
        `;
    }

    // disjoint classes
    if (subclass.disjoint_classes && subclass.disjoint_classes.length > 0) {
        html += `
            <tr>
                <th>disjoint with</th>
                <td>
                <span class="inline-list">
                    ${subclass.disjoint_classes.map(disClass => `
                    <a href="#${disClass.iri}" title="${disClass.iri}">${disClass.name}</a>
                    `).join('')}
                </span>
                </td>
            </tr>
        `;
    }

    html += `
        </tbody>
        </table>
        <p align="right">
            <a href="#${parentLobe.replace(/\s/g, '_')}">back to ${parentLobe}</a>
        </p>
        </div>
    `;

    subclass.subclasses.forEach(subSub => {
        html += renderSubclass(subSub, parentLobe, depth + 1);
    });

    return html;
}

