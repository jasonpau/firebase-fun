// intial config settings and initialization of Firebase
const config = {
  apiKey: "AIzaSyA6lQg9S0_JyvgTmO1ZhSpxlUcgwC-w28A",
  authDomain: "basic-operations.firebaseapp.com",
  databaseURL: "https://basic-operations.firebaseio.com",
  projectId: "basic-operations",
  storageBucket: "basic-operations.appspot.com",
  messagingSenderId: "271997325089"
};
firebase.initializeApp(config);
const fbRef = firebase.database();

// 8b. Remove a student using null
// fbRef.ref('students/3').set(null);

function updateDom(d) {
  const table = $('.sgt tbody');
  table.html('');
  for (let key in d) {
    if (d.hasOwnProperty(key)) {
      const row = $('<tr>');
      const id = $('<td class="student_id">' + d[key].student_id + '</td>');
      const name = $('<td class="student_name">' + d[key].student_name + '</td>');
      const course = $('<td class="course">' + d[key].course + '</td>');
      const grade = $('<td class="grade">' + d[key].grade + '</td>');
      const actions = $('<td>', {'data-uid': key});
      const edit = $('<button>', {
        class: 'btn btn-sm btn-info edit',
        text: 'Edit'
      });
      const del = $('<button>', {
        class: 'btn btn-sm btn-danger delete',
        text: 'Delete'
      });

      table.append(row.append(id, name, course, grade, actions.append(edit, del)));
    }
  }
}

function addStudent() {
  let button = $('#add-student');

  if (button.attr('editing')) {
    fbRef.ref('students/' + button.attr('editing')).update(getFormData());
    button.removeAttr('editing').text('Add Student');
  } else {
    fbRef.ref('students').push(getFormData());
  }
  clearForm();
}

function editStudent(event) {
  // add edit mode status
  $('#add-student')
    .attr('editing', event.target.parentElement.getAttribute('data-uid'))
    .text('Update Student');
  populateFormData(getRowData($(event.target.parentElement.parentElement)));
}

function deleteStudent(event) {
  const name = event.target.parentElement.parentElement.getElementsByClassName('student_name')[0].innerText;
  if (confirm('Are you sure you want to delete ' + name + ' from the database?')) {
    let uid = event.target.parentElement.getAttribute('data-uid');
    fbRef.ref('students/' + uid).remove();
  }
}

function clearForm() {
  $('.sgt-form input').each(function (index, element) {
    $(element).val('');
  });
}

function getFormData() {
  const output = {};
  $('.sgt-form input').each(function (index, element) {
    const ele = $(element);
    output[ele.attr('id')] = ele.val();
  });
  return output;
}

// receives a student data object and assigns the properties to the form input values
function populateFormData(data) {
  console.log('populateFormData called');

  $('#student_id').val(data.student_id);
  $('#student_name').val(data.student_name);
  $('#course').val(data.course);
  $('#grade').val(data.grade);
}

// outputs a student data object, based on the info from the table row that was clicked
function getRowData(e) {
  console.log('getRowData called');
  return {
    student_id: e.find('.student_id').text(),
    student_name: e.find('.student_name').text(),
    course: e.find('.course').text(),
    grade: e.find('.grade').text()
  };
}

$(document).ready(function() {
  setUpEventListeners();
});

function setUpEventListeners() {

  // this sets up an event listener that listens for data changes and runs till the end of time
  fbRef.ref('students').on('value', function (snapshot) {
    console.log('snapshot', snapshot);
    updateDom(snapshot.val());
  });

  $('#clear-form').click(clearForm);
  $('#add-student').click(addStudent);
  $('.table')
    .on('click', '.edit', editStudent)
    .on('click', '.delete', deleteStudent);
}