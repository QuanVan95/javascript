// Example 
var coursesApi = 'http://localhost:3000/courses'

function start() {
    getCourses(renderCourses);
    handleCreateCourse();
}

start();

function getCourses(callback) {
    fetch(coursesApi)
        .then(response => response.json())
        .then(callback)
}

function renderCourses(courses) {
    var courseListBlock = document.querySelector('#course-list')
    var html = courses.map(course => {
        return `<li class="course-item-${course.id}">
                    <h4>${course.name}</h4>
                    <p>${course.description}</p>
                    <button onclick="deleteCourse(${course.id})">Xoa</button>
                </li>`
    })
    courseListBlock.innerHTML = html.join('')
}

function createCourse(courseData, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(courseData),
    }
    fetch(coursesApi, options)
        .then(response => response.json())
        .then(callback)
        .catch(error => {
            console.log(error)
        })
}

function deleteCourse(courseId) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(coursesApi + '/' + courseId, options)
        .then(response => response.json())
        .then(() => {
            var courseItem = document.querySelector('.course-item-' + courseId)
            console.log(courseItem);
            if (courseItem) {
                courseItem.remove();
            }
        })
}

function handleCreateCourse() {
    var createBtn = document.querySelector('#create')
    createBtn.onclick = () => {

        var name = document.querySelector('input[name="name"]').value
        var description = document.querySelector('input[name="description"]').value
        var courseData = {
            name: name,
            description: description
        }
        createCourse(courseData, () => {
            getCourses(renderCourses)
        })

    }
}

var course = {
    name: 'JS',
    price: 1000,
    image: 'img-address',
    children: {
        name: 'ReactJS'
    }
}

var { name: parentName, children: { name: childrenName } } = course
console.log(parentName, childrenName)

var array1 = ['JS', ' PHP']
var array2 = ['ReactJS', 'NodeJS']
var array3 = [...array1, ...array2]
console.log(array3);

var object1 = {
    name: 'JS'
}

var object2 = {
    price: 20000
}

var object3 = {
    ...object1,
    ...object2,
    newkey: 'Bi Hero',
    price: 50000 //replace the old key - value
}

console.log(object3)
console.log(...array2)

// Tagged template literals
function highlight(...rest) {
    console.log(rest);
}

var brand = 'FB';
var course = 'Javascript';

highlight`Bi em test ${brand} cùng với ${course} hehe!`


var promise1 = new Promise((resolve) => {
    setTimeout(() => {
        resolve([1]);
    }, 1000)
})

var promise2 = new Promise((resolve) => {
    setTimeout(() => {
        resolve([2, 3]);
    }, 2000)
})

var promise3 = Promise.reject("Error - Promise!")

Promise.all([promise1, promise2, promise3])
    .then(([result1, result2]) => {
        console.log(result1.concat(result2))
    })
    .catch((error) => {
        console.log(error)
    })

var users = [
    {
        id: 113,
        name: 'Linh Boo'
    },
    {
        id: 114,
        name: 'Biii'
    },
    {
        id: 115,
        name: 'Con Zic'
    },
];

var comments = [
    {
        id: 1,
        user_id: 113,
        content: 'Chua ra video'
    },
    {
        id: 2,
        user_id: 114,
        content: 'Da ra video'
    }
];

function getComments() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(comments)
        }, 1000)
    })
}

function getUsersByIds(userIds) {
    return new Promise((resolve) => {
        var result = users.filter((user) => {
            return userIds.includes(user.id)
        })
        setTimeout(() => {
            resolve(result)
        }, 2000);
    })
}

getComments()
    .then(comments => {
        var userIds = comments.map(comment => { return comment.user_id })

        return getUsersByIds(userIds)
            .then((users) => {
                return {
                    users: users,
                    comments: comments
                };
            })
    })
    .then(data => {
        var commentBlock = document.getElementById("comment-block");
        var html = '';
        data.comments.forEach((comment) => {
            var user = data.users.find((user) => {
                return user.id === comment.user_id
            });
            html += `<li>${user.name}: ${comment.content}</li>`;
        });
        commentBlock.innerHTML = html;
    })

var postApi = 'https://jsonplaceholder.typicode.com/users'

fetch(postApi)
    .then(response => response.json())
    .then(users => {
        var htmls = users.map(user => {
            return `<li>
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </li>`
        })
        var html = htmls.join('')
        document.getElementById("user-block").innerHTML = html;
    })
    .catch(error => {
        console.log(error)
    })


//IIFE
const app = {
    cars: [],
    add(car) {
        this.cars.push(car)
    }
}
//Call app.cars = null => failed
const app = (function (i) {
    const cars = []
    return {
        get(index) {
            return cars[index]
        },
        getAllCars() {
            return cars
        },
        add(car) {
            cars.push(car)
        },
        edit(index, car) {
            cars[index] = car
        },
        delete(index) {
            cars.splice(index, 1)
        }
    }
})()


