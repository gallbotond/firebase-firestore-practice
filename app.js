const itemList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

//create element and render it
function renderItem(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let location = document.createElement('span');
    let difficulty = document.createElement('span');
    let isCompleted = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    location.textContent = doc.data().location;
    difficulty.textContent = doc.data().difficulty;
    isCompleted.textContent = doc.data().isCompleted;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(location);
    li.appendChild(difficulty);
    li.appendChild(isCompleted);
    li.appendChild(cross);

    itemList.append(li);

    //delete data
    cross.addEventListener('click', (e) => {
        e.preventDefault();
        let crossId = e.target.parentElement.getAttribute('data-id');
        dataBase.collection('list-items').doc(crossId).delete();
    })
}

//get data
/* dataBase.collection('list-items').orderBy('name').get().then((databaseSnapshot) => {
    databaseSnapshot.docs.forEach(doc => {
        renderItem(doc);
    });
}) */

//create data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    dataBase.collection('list-items').add({
        name: form.name.value,
        location: form.location.value,
        difficulty: form.difficulty.value,
        isCompleted: false
    })
    form.reset();
})

//real-time listener
dataBase.collection('list-items').orderBy('name').onSnapshot( (snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderItem(change.doc);
        }else if(change.type == 'removed'){
            let li = itemList.querySelector('[data-id=' + change.doc.id + ']');
            itemList.removeChild(li);
        }
    });
})