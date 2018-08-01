var docHTML = ''
var Courses = []

class Course {
    constructor(title, time, days, location, instructor, startDate, endDate) {
        this.title = title;
        this.time = time;
        this.days = days;
        this.location = location;
        this.instructor = instructor;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

$(document).ready(function() {
    var courseTitles = [];
    var courseTimes = [];
    var courseDays = [];
    var courseLocations = [];
    var courseInstructors = [];
    $("#parseHTML").click(function() {
        //console.log($('#html').val());
        docHTML = $('#html').val();
        $('#scheduletable').html(docHTML);
        $('*[id*=win0divE_CLASS_DESCR]:visible').each(function() {
            var x = $(this.childNodes[0])
            courseTitles.push(x[0].innerText)
            //console.log("Title: " + x[0].innerText);
        });
        $('*[id*=win0divDERIVED_REGFRM1_SSR_MTG_SCHED_LONG]:visible').each(function() {
            var x = $(this.childNodes[0])
            var times = x[0].innerText.split(" ").slice(1).join(' ')
            if (times == "" || times == " ") {
                courseTimes.push("N/A")
            } else {
                courseTimes.push(times)
            }
            //console.log("Times: " + times);
        });
        $('*[id*=win0divDERIVED_REGFRM1_SSR_MTG_SCHED_LONG]:visible').each(function() {
            var x = $(this.childNodes[0])
            var days = x[0].innerText.split(" ")[0]
            if (days == "TBA" || days == "" || days.replace(/\s/g, '').length == 0) {
                courseDays.push("N/A")
            } else {
                courseDays.push(days)
            }
            //console.log("Days: " + days);
        });
        $('*[id*=win0divDERIVED_REGFRM1_SSR_MTG_LOC_LONG]:visible').each(function() {
            var x = $(this.childNodes[0])
            courseLocations.push(x[0].innerText)
            //console.log("Locations: " + x[0].innerText);
        });
        $('*[id*=win0divDERIVED_REGFRM1_SSR_INSTR_LONG]:visible').each(function() {
            var x = $(this.childNodes[0])
            courseInstructors.push(x[0].innerText)
            //console.log("Instructors: " + x[0].innerText);
        });
        // console.log(courseTitles.length)
        // console.log(courseTimes.length)
        // console.log(courseLocations.length)
        // console.log(courseInstructors.length)
        for (var i = 0; i < courseTitles.length; i++) {
            populateClassesTable(courseTitles[i], courseTimes[i], courseDays[i], courseLocations[i], courseInstructors[i], "", "", i)
        }
        $('#SubmitClassesButton').show();


        $('#scheduletable').html("");
    });
    //console.log(htmlDoc);
});

function populateClassesTable(courseTitle, courseTime, courseDays, courseLocation, courseInstructor, courseStartDate, courseEndDate, counter) {
    var newRow = $('<tr class="course">');
    var cols = "";

    cols += '<td><input type="text" class="form-control" value="' + courseTitle + '" id="courseTitle' + counter + '"/></td>';
    cols += '<td><select id="ClassColors" onchange="updateSelected()"> <option class="">Pick a Color </option> <option class="_1">Lavendar</option><option class="_2">Sage</option><option class="_3">Grape</option><option class="_4">Flamingo</option><option class="_5">Banana</option><option class="_6">Tangerine</option><option class="_7">Peacock</option><option class="_8">Graphite</option><option class="_9">Blueberry</option><option class="_10">Basil</option><option class="_11">Tomato</option> </select></td>';
    cols += '<td><input type="text" class="form-control" value="' + courseDays + '" id="courseDay' + counter + '"/></td>';
    cols += '<td><input type="text" class="form-control" value="' + courseTime + '" id="courseTime' + counter + '"/></td>';
    cols += '<td><input type="text" class="form-control" value="' + courseLocation + '" id="courseLocation' + counter + '"/></td>';
    cols += '<td><input type="text" class="form-control" value="' + courseInstructor + '" id="courseInstructor' + counter + '"/></td>';
    cols += '<td><input type="date" class="form-control" value="2018-08-22" id="courseStartDate' + counter + '"/></td>';
    cols += '<td><input type="date" class="form-control" value="2018-11-30" id="courseEndDate' + counter + '"/></td>';
    cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger "  value="Delete"></td>';
    newRow.append(cols);
    $("#myClassTable").append(newRow);
}

function getUserData() {
    console.log("Validating data");
    counter = 0;
    $("tr.course").each(function() {
        var courseTitle = $(this).find("#courseTitle" + counter).val();
        var courseTime = $(this).find("#courseTime" + counter).val();
        var courseDay = $(this).find("#courseDay" + counter).val();
        var courseLocation = $(this).find("#courseLocation" + counter).val();
        var courseInstructor = $(this).find("#courseInstructor" + counter).val();
        var courseStartDate = $(this).find("#courseStartDate" + counter).val();
        var courseEndDate = $(this).find("#courseEndDate" + counter).val();
        counter++;
        let tempCourse = new Course(courseTitle, courseTime, courseDay, courseLocation, courseInstructor, courseStartDate, courseEndDate)
        //console.log(tempCourse)
        Courses.push(tempCourse);
    });
    if (validateData()) {
        createEvents();
    } else {
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'One or more classes is incorrectly formatted!',
            footer: 'Make sure you entered valid dates for the start and end'
        })
    }

}

function validateData() {
    for (var i = 0; i < Courses.length; i++) {
        if (Courses[i].title == "" || Courses[i].time == "" || Courses[i].days == "" || Courses[i].location == "" || Courses[i].instructor == "" || Courses[i].startDate == "" || Courses[i].endDate == "") {
            if (Courses[i].startDate == "" || Courses[i].endDate == "") {
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'One or more class dates is incorrectly formatted!',
                })
            }
            return false
        }
    }
    return true;
}

function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if (time.indexOf('AM') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if (time.indexOf('PM') != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    if (time.indexOf('AM') != -1) {
        return time.split("AM")[0] + ":00";
    }
    if (time.indexOf('PM') != -1) {
        return time.split("PM")[0] + ":00";
    }

}

function getByDayArray(i) {
    var byDay = []
    if (Courses[i].days.includes('Mo')) {
        byDay.push("MO")
    }
    if (Courses[i].days.includes('Tu')) {
        byDay.push("TU")
    }
    if (Courses[i].days.includes('We')) {
        byDay.push("WE")
    }
    if (Courses[i].days.includes('Th')) {
        byDay.push("TH")
    }
    if (Courses[i].days.includes('Fr')) {
        byDay.push("FR")
    }
    if (Courses[i].days.includes('Sa')) {
        byDay.push("SA")
    }
    if (Courses[i].days.includes('Su')) {
        byDay.push("SU")
    }
    var stringByDay = byDay.join(',')
    return stringByDay;
}

function createEvents() {
    for (var i = 0; i < Courses.length; i++) {
        if (Courses[i].days != "N/A" || Courses[i].time != "N/A") {
            //console.log(Courses[i])
            //console.log(Courses[i].time.split(" "))
            // console.log("Start time: " + convertTo24Hour(Courses[i].time.split(" ")[0]))
            // console.log("End time: " + convertTo24Hour(Courses[i].time.split(" ")[2]))
            var startTime = convertTo24Hour(Courses[i].time.split(" ")[0])
            var endTime = convertTo24Hour(Courses[i].time.split(" ")[2])
            var stringByDay = getByDayArray(i)
            var tempEvent = {
                'summary': Courses[i].title,
                'colorId': "6",
                'location': Courses[i].location,
                'description': 'Autoo generated by CalCentralCalendar for ' + Courses[i].title + '.',
                'start': {
                    'dateTime': Courses[i].startDate + "T" + startTime,
                    'timeZone': 'America/Los_Angeles'
                },
                "end": {
                    "dateTime": Courses[i].startDate + "T" + endTime,
                    'timeZone': 'America/Los_Angeles'
                },
                'recurrence': [
                    "RRULE:FREQ=WEEKLY;UNTIL=" + Courses[i].endDate.replace(/-/g, '') + ";BYDAY=" + stringByDay
                ],
                'reminders': {
                    'useDefault': false,
                    'overrides': [
                        { 'method': 'popup', 'minutes': 15 }
                    ]
                }
            };
            console.log(tempEvent)
            // var tempEvent = {
            //     'summary': 'Google I/O 2015',
            //     'location': '800 Howard St., San Francisco, CA 94103',
            //     'description': 'A chance to hear more about Google\'s developer products.',
            //     'start': {
            //         'dateTime': '2018-07-28T09:00:00-07:00',
            //         'timeZone': 'America/Los_Angeles'
            //     },
            //     'end': {
            //         'dateTime': '2018-07-28T17:00:00-07:00',
            //         'timeZone': 'America/Los_Angeles'
            //     },
            //     'recurrence': [
            //         'RRULE:FREQ=DAILY;COUNT=2'
            //     ],
            //     'attendees': [
            //         { 'email': 'lpage@example.com' },
            //         { 'email': 'sbrin@example.com' }
            //     ],
            //     'reminders': {
            //         'useDefault': false,
            //         'overrides': [
            //             { 'method': 'email', 'minutes': 24 * 60 },
            //             { 'method': 'popup', 'minutes': 10 }
            //         ]
            //     }
            // };
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': tempEvent
            });
            request.execute(function(event) {
                swal(
                    'Congrats!',
                    'Your classes were created!',
                    'success'
                )
            });
        }
    }
    // console.log("Creating event");
    // var event = {
    //     'summary': 'Google I/O 2015',
    //     'location': '800 Howard St., San Francisco, CA 94103',
    //     'description': 'A chance to hear more about Google\'s developer products.',
    //     'start': {
    //         'dateTime': '2018-07-28T09:00:00-07:00',
    //         'timeZone': 'America/Los_Angeles'
    //     },
    //     'end': {
    //         'dateTime': '2018-07-28T17:00:00-07:00',
    //         'timeZone': 'America/Los_Angeles'
    //     },
    //     'recurrence': [
    //         'RRULE:FREQ=DAILY;COUNT=2'
    //     ],
    //     'attendees': [
    //         { 'email': 'lpage@example.com' },
    //         { 'email': 'sbrin@example.com' }
    //     ],
    // 'reminders': {
    //     'useDefault': false,
    //     'overrides': [
    //         { 'method': 'email', 'minutes': 24 * 60 },
    //         { 'method': 'popup', 'minutes': 10 }
    //     ]
    // }
    // };
    // var request = gapi.client.calendar.events.insert({
    //     'calendarId': 'primary',
    //     'resource': event
    // });

    // request.execute(function(event) {
    //     appendPre('Event created: ' + event.htmlLink);
    // });
}

// function createModal() {
//     $('#dialog-form').dialog({
//         width: 600,
//         modal: true,
//         open: function() {
//             //$(this).html(generateMoreInformationModal(courseTitles[i], courseTimes[i], courseLocations[i], courseInstructors[i]));
//         },
//         buttons: {
//             "Create Class": function() {
//                 console.log($('#courseTitle').val());
//             },
//             Cancel: function() {
//                 dialog.dialog('close')
//             }
//         },
//         close: function(event, ui) {
//             // do whatever you need on close
//         }
//     });
// }



// function generateMoreInformationModal(title, time, location, instructor, i) {
//     console.log(title + " " + time + " " + location + " " + instructor)
//     var HTMLcode = "<div id=\"dialog-form\" title=\"Create new class\">" +
//         "<p class=\"validateTips\">All form fields are required.</p>" +
//         "<form>" +
//         "<fieldset>" +
//         "<label for=\"name\">Course Title:</label>" +
//         "<input type=\"text\" name=\"courseTitle\" id=\"courseTitle" + i + "\"  value=\"" + title + "\" class=\"text ui-widget-content ui-corner-all\">" +
//         "<label for=\"email\">Course Time:</label>" +
//         "<input type=\"text\" name=\"courseTime\" id=\"courseTime\" value=\"" + time + "\" class=\"text ui-widget-content ui-corner-all\">" +
//         "<label for=\"password\">Course Location:</label>" +
//         "<input type=\"text\" name=\"courseLocation\" id=\"courseLocation\" value=\"" + location + "\" class=\"text ui-widget-content ui-corner-all\">" +
//         "<label for=\"instructor\">Course Instructor:</label>" +
//         "<input type=\"text\" name=\"courseInstructor\" id=\"courseInstructor\"  value=\"" + instructor + "\" class=\"text ui-widget-content ui-corner-all\">" +
//         "<input type=\"submit\">" + 

//         "</fieldset>" +
//         "</form>" +
//         "</div>"
//     return HTMLcode;
// }