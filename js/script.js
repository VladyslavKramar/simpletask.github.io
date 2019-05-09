var header = document.querySelector('.header');
var clear = document.querySelector('.clear');
var dateElement = document.querySelector('#date');
var list = document.querySelector('#ul-list');
var input = document.querySelector('#input');
var addItem = document.querySelector('.add-item');
var openModalBTN = document.getElementById('open-modal');
var closeModalBTN = document.getElementById('close-modal');
var modalWindow = document.querySelector('.modal');
var modalContent = document.querySelector('.modal-content');

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';

var imageArr = [
    'img/pic_1.jpg', 
    'img/pic_2.jpg', 
    'img/pic_3.jpg', 
    'img/pic_4.jpg', 
    'img/pic_5.jpg', 
    'img/pic_6.jpg', 
    'img/pic_7.jpg', 
    'img/pic_8.jpg', 
    'img/pic_9.jpg', 
    'img/pic_10.jpg'
];
var LIST, id;

var data = localStorage.getItem('TODO');

if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
};

function loadList(array) {
    array.forEach(function(item) {
        addToDo(item.name, item.id, item.done, item.trash);
    });
};

var clearEvents = ['click', 'tap'];

clearEvents.forEach(function(event) {
    clear.addEventListener(event, function() {
        localStorage.clear();
        location.reload();
    });
});

const options = {weekday: 'long', month: 'long', day: 'numeric'};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString('en-US', options);


function addToDo(toDo, id, done, trash) {
    if (trash) {
        return;
    };

    let formatedToDo = toDo;
    formatedToDo = formatedToDo.replace(/<[^>]+>/g,'');
    toDo = formatedToDo;

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : '';

    var position = 'beforeend';
    var text = `<li class="item">
                <i class="fa ${DONE} fa-fw" job="complete" id="${id}" aria-hidden="true"></i>
                <p class="text ${LINE}"> ${toDo} </p>
                <i class="fa fa-pencil" job="edit" id="${id}" aria-hidden="true"></i>
                <i class="fa fa-times fa-fw" job="delete" id="${id}" aria-hidden="true"></i>
                </li>`;
    
    list.insertAdjacentHTML(position, text);
};

function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);
    LIST[element.id].done = LIST[element.id].done ? false : true;
};

function editToDo(element) {
    let item = element.parentNode;
    let itemP = item.querySelector('.text');
    // let input = document.createElement('input');
    let input = document.createElement('textarea');
    let itemValue = itemP.innerHTML.trim();
    let newValue;
    input.classList.add('input', 'edit');
    input.style.width = itemP.clientWidth - 5 + 'px';
    input.style.height = itemP.clientHeight + 'px';
    input.value = itemValue;
    itemP.textContent = '';
    itemP.appendChild(input);
    input.focus();

    var events = ['keyup', 'keydown', 'keypress'];
    events.forEach(function(event) {
        input.addEventListener(event, function(e) {
            setTimeout(function() {
                input.style.height = 24 + 'px';
                input.style.height = input.scrollHeight + 'px';
            }, 0);
            // input.style.height = itemP.offsetHeight + (input.scrollTop) + 'px';
            // // itemP.style.height = input.offsetHeight + itemP.offsetHeight + 'px';
        });
    });

    var events = ['keypress', 'blur'];
    var removed = false;

    events.forEach(function(event) {
        if (event == 'keypress') {
            input.addEventListener('keypress', function(e) {
                if (e.keyCode == 13) {
                    newValue = input.value;
                    if (newValue.length == 0) {
                        if (removed) {
                            return;
                        };
                        removed = true;
                        item.parentNode.removeChild(element.parentNode);
                        LIST[element.id].trash = true;
                    };
                    endOfEditToDo(element, newValue);
                };
                localStorage.setItem('TODO', JSON.stringify(LIST));
            });
        } else if (event == 'blur') {
            input.addEventListener('blur', function(e) {
                    newValue = input.value;
                    if (newValue.length == 0) {
                        if (removed) {
                            return;
                        };
                        removed = true;
                        item.parentNode.removeChild(element.parentNode);
                        LIST[element.id].trash = true;
                    };
                    endOfEditToDo(element, newValue);
                    localStorage.setItem('TODO', JSON.stringify(LIST));
                });
        };
    });

    return true;
};

function endOfEditToDo(element, newValue) {
    let item = element.parentNode;
    let itemP = item.querySelector('.text');
    let input = item.querySelector('input');
    
    LIST[element.id].name = newValue;
    itemP.textContent = newValue;

};

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
};

function doAdd(e) {
    if (e.keyCode == 13 || e.target.nodeName == 'I') {
        var toDo = input.value;
        if (toDo) {
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
            input.value = '';
            localStorage.setItem('TODO', JSON.stringify(LIST));
            id++;
            console.log(LIST);
        } else {
            return;
        };
    } else {
        return;
    };
};

window.addEventListener('load', function() {
    header.style.background = `url(${imageArr[Math.floor(Math.random() * imageArr.length)]})`;
    header.style.backgroundSize = 'cover';
});

document.addEventListener('keypress', doAdd);
addItem.addEventListener('click', doAdd);

list.addEventListener('click', function(event) {
    var element = event.target;
    var res;
    if (event.target.nodeName == 'I') {
        const elementJob = event.target.attributes.job.value;
        if (elementJob == 'complete') {
            completeToDo(element);
        } else if (elementJob == 'delete') {
            removeToDo(element);
        } else if (elementJob == 'edit') {
            editToDo(element);
        };
        localStorage.setItem('TODO', JSON.stringify(LIST));
    } else {
        return;
    };
});

// Modal window script
function openModal(e) {
    modalWindow.classList.remove('disappear');
    modalWindow.classList.add('appear');
    modalWindow.style.display = 'block';
    e.preventDefault();
};

function closeModal(e) {
    modalWindow.classList.remove('appear');
    modalWindow.classList.add('disappear');
    setTimeout(function() {
        modalWindow.style.display = 'none';
    }, 400);
    e.preventDefault();
};

window.addEventListener('load', function() {
    sessionStorage.setItem('firstVisit', '1');
    if (!sessionStorage.getItem('firstVisit') === "1") {
        setTimeout(function() {
            modalWindow.classList.remove('disappear');
            modalWindow.classList.add('appear');
            modalWindow.style.display = 'block';
        }, 300);
    };
    
});

window.addEventListener('click', function(e) {
    if (e.target == modalWindow) {
        closeModal();
    } else {
        return;
    };
});

openModalBTN.addEventListener('click', openModal);
closeModalBTN.addEventListener('click', closeModal);

// =========================================================================================================
