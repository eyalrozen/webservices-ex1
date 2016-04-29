var express = require('express');
var app = express();
var student = require('./student');
var parsedJSON = require('./data/students');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var studentsListFromJSON = parsedJSON.students;
var studentsList = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

function Init()
{
	studentsListFromJSON.forEach(CreateStudent);
}

function CreateStudent(element)
{
	var newStud = new student(element.name,element.id,element.age,element.department,element.grades_avg);
	studentsList.push(newStud);
}

function GetAllStudents()
{
	var allStudentsList = '{"students" : [';
	for(var i in studentsList)
	{
		allStudentsList += studentsList[i].PrintStudentDetails();
		if(i < studentsList.length-1)
		{
			allStudentsList += ',';
		}
	}
	allStudentsList += ' ]}';
	var result = JSON.parse(allStudentsList);
	return result;
}

function GetStudentGradeByID(stud_id)
{
	for(var i in studentsList)
	{
		if(studentsList[i].id == stud_id){
			var result = {"name" : studentsList[i].name , "grade" : studentsList[i].grades_avg};
			return result;
		}
	}
	return {"error" :'No such student!'};
}

function GetStudentsByDepartment(department_name)
{
	var allStudentsList = '{"students" : [';
	for(var i in studentsList)
	{
		if(studentsList[i].department == department_name){
			allStudentsList += studentsList[i].PrintStudentDetails();
			if(i < studentsList.length-1)
			{
				allStudentsList += ',';
			}
		}
	}
	allStudentsList += ' ]}';
	var result =  JSON.parse(allStudentsList);
	return result;
}

exports.GetStudByDep = GetStudentsByDepartment;
exports.GetAllStudents = GetAllStudents;
exports.GetStudGradeByID = GetStudentGradeByID;

app.get('/',function(req,res){
	res.json({'page':'main'});
});
app.get('/getAllExcellenceStudents',function(req,res){
	var result = GetAllStudents();
	res.json(result);
});

app.get('/getStudentGrade/:stud_id',function(req,res){
	var studID = req.params.stud_id;
	var studentGrade = GetStudentGradeByID(studID);
	res.json(studentGrade);
});

app.get('/GetStudentsByDepartment/:department_name',function(req,res){
	var depName = req.params.department_name;
	var departmentStudents = GetStudentsByDepartment(depName);
	res.json(departmentStudents);
});

Init();
app.listen(port);
console.log('listening on port '+ port);