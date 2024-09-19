
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "SCHOOL-DB";
var empRelationName = "SCHOOL-TABLE";
var connToken = "90932010|-31949219341994500|90962675";

$("#Rollno").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollnoAsJsonObj() {
    var Rollno = $("#Rollno").val();
    var jsonStr = {
        Rollno: Rollno
    };
    return JSON.stringify(jsonStr);
}


function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#empname').val(data.name);
    $('#empsal').val(data.salary);
    $('#hra').val(data.hra);
    $('#da').val(data.da);
    $('#deduct').val(data.deduct);
}


function resetForm() {
    $('#Rollno').val("");
    $('#empname').val("");
    $('#empsal').val("");
    $('#hra').val("");
    $('#da').val("");
    $('#deduct').val("");
    $('#Rollno').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#Rollno').focus();
}


function validateData(){
    var Rollno, empname, empsal, hra, da, deduct;
    Rollno = $('#Rollno').val();
    empname = $('#empname').val();
    empsal = $('#empsal').val();
    hra = $('#hra').val();
    da = $('#da').val();
    deduct = $('#deduct').val();
    if (Rollno === "") {
        alert("Student ID missing");
        $('#Rollno').focus();
        return "";
    }
    if (empname === "") {
        alert("Student Name missing");
        $('#empname').focus();
        return "";
    }
    if (empsal === "") {
        alert("Student class missing");
        $('#empsal').focus();
        return "";
    }
    if (hra === "") {
        alert("Student date of birth missing");
        $('#hra').focus();
        return "";
    }
    if (da === "") {
        alert("Student address missing");
        $('#da').focus();
        return "";
    }
    if (deduct === "") {
        alert("Student Enrollment date missing");
        $('#deduct').focus();
        return "";
    }

    var jsonStrObj = {
        Rollno: Rollno,
        FullName: empname,
        Class: empsal,
        BirthDate: hra,
        Address: da,
        EnrollmentDate: deduct
    };
    return JSON.stringify(jsonStrObj);
}

function getEmp() {

    var RollnoJsonObj = getRollnoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, RollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#empname').focus();
    } else if (resJsonObj.status === 200) {

        $('#Rollno').prop("disabled", true);
        fillData(resJsonObj);
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#empname').focus();
    }

}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#Rollno').focus();
}


function changeData() {
    $('#change').prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#Rollno').focus();
}

