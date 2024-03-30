// script.js
document.getElementById('addSubject').addEventListener('click', function() {

    const subjectContainer = document.querySelector('.subject-details');
    const newSubject = document.createElement('div');
    newSubject.classList.add('subject');
    newSubject.innerHTML = `
        <input type="text" class="subject-name" placeholder="Subject Name" required>
        <input type="number" class="subject-marks" placeholder="Marks" min="0" max="100" required>
    `;
    subjectContainer.appendChild(newSubject);
});



document.getElementById('gradeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const rollNo = document.getElementById('rollNo').value;
    const className = document.getElementById('class').value;
    const school = document.getElementById('school').value;
    const logo = document.getElementById('logo').files[0];
    const subjects = document.querySelectorAll('.subject');
    
    // Prepare subject details
    const subjectDetails = [];
    subjects.forEach(subject => {
        const subjectName = subject.querySelector('.subject-name').value;
        const subjectMarks = subject.querySelector('.subject-marks').value;
        subjectDetails.push({ name: subjectName, marks: subjectMarks });
    });

    // Generate PDF
    generatePDF(name, rollNo, className, school, logo, subjectDetails);
});

function generatePDF(name, rollNo, className, school, logo, subjectDetails) {
    var doc = new jsPDF();

    var pageWidth = doc.internal.pageSize.width;
    var pageHeight = doc.internal.pageSize.height;
    var margin = 15;

    var backgroundColor = '#f0f0f0';
    doc.setFillColor(backgroundColor); // Set fill color
    // doc.rect(0, 0, pageWidth, pageHeight, 'F'); 

    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);


    var y = margin+20;

    // Load background logo if provided
    if (logo) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageData = event.target.result;
            // Add background logo once loaded
            // doc.addImage(imageData, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
            doc.addImage(imageData, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

            addContentToPDF();
        };
        reader.readAsDataURL(logo);
    } else {
        addContentToPDF();
    }

    function addContentToPDF() {
        // Add content to PDF
        // var max_marks = 100;
        doc.setFontSize(30);
        doc.setTextColor(76,31,25); // Set text color to black

        doc.setLineWidth(0.5);
        // doc.line(20, 15, 190, 15);
        doc.setFontStyle('italic');

        doc.text(70, y, 'Report Card');

        // doc.line(20, 30, 190, 30);

        doc.setFontSize(15);
        doc.setFontStyle('bold');
        y+=30;

        doc.text(margin+10,y, `Name: ${name}`);
        y+=15;
        doc.text(margin+10, y, `Roll No: ${rollNo}`);
        y+=15;
        doc.text(margin+10, y, `Class: ${className}`);
        y+=15;
        doc.text(margin+10, y, `School: ${school}`);
        y+=20;
        doc.line(margin+10, y, 190, y);
        y+=10;

        doc.setFontStyle('bold');
        doc.text(margin+10, y, 'Subject');
        doc.text(margin+70 , y, 'Marks Obtained');
        doc.text(margin+120, y, 'Maximum Marks');
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(margin+10, y, 190, y);
        y += 5;

        // subjects.forEach(subject => {
        //     doc.setFontStyle('normal');
        //     doc.text(20, y, subject.name);
        //     doc.text(90, y, subject.marks);
        //     doc.text(150, y, '100');
           
        // });



        // doc.setFontSize(14);
        // let y = 70;

        subjectDetails.forEach(subject => {
            doc.setFontStyle('normal');
            doc.text(margin+10, y, ` ${subject.name}`);
            doc.text(margin+80, y, `${subject.marks}`);
            doc.text(margin+130,y,'100');
            doc.line(margin+70, y - 5,margin+70,y + 5); // Vertical  line
            doc.line(margin+120, y - 5, margin+120 ,y + 5); // Vertical line
            // y += 10;

            y += 10;
        });
        y-=5;
        doc.setLineWidth(0.5);
        doc.line(margin+10, y, 190, y);
        y+=10;

        const totalMarks = subjectDetails.reduce((acc, curr) => acc + parseInt(curr.marks), 0);
        const overallPercentage = ((totalMarks / (subjectDetails.length * 100)) * 100).toFixed(2);
    
        doc.setFontStyle('bold');
        doc.text(margin+10,y,'Total Marks: ');
        doc.text(margin+90,y,`${totalMarks}`);
        y+=10;
        doc.text(margin+10, y, 'Overall Percentage:');
        doc.text(margin+90, y, `${overallPercentage}%`);
        y += 10;
        doc.line(margin+10, y, 190, y);
        y+=10;

        doc.setFontSize(10);
        doc.text(margin+10, y, 'This is a computer generated grade sheet.');



        // Save PDF
        doc.save(`${name}_grade_sheet.pdf`);
    }
}
