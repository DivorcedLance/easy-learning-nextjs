School:
  - schoolId
  - displayName
  - fullName
  - logoLink
  - primaryColor
  - secondaryColor
  
Teacher:
  - teacherId
  - codTeacher
  - dni
  - email
  - firstName
  - lastName
  - password
  - profilePictureLink
  - schoolId
  - sex

Student:
  - studentId
  - codStudent
  - currentGrade
  - dni
  - email
  - firstName
  - lastName
  - password
  - profilePictureLink
  - schoolId
  - sex

Student - LearningStyle
  - studentId
  - learningStyleId
  - result

LearningStyle:
  - learningStyleId
  - color
  - description
  - name

Course:
  - courseId
  - codCourse
  - courseName
  - schoolId

Classroom:
  - classroomId
  - courseId
  - grade
  - schoolId
  - section
  - teacherId

Classroom - Student:
  - classroomId
  - studentId

QuestionTemplate
  - questionTemplateId
  - templateName

QuestionTemplate - LearningStyle:
  - questionTemplateId
  - learningStyleId

Question:
  - questionId
  - courseId
  - dataId
  - grade
  - lastModification
  - schoolId
  - templateId
  - week

Image:
  - imageId
  - imageLink
  - imageHeight
  - imageWidth

DataTemplate1:
  - dataId
  - statement
  - imageId
  - options []

DataTemplate1 - Options
  - dataId
  - optionIndex
  - option
  - isCorrect

AnswerTemplate1:
  - answerId
  - isCorrect

AnswerTemplate1 - Options
  - answerId
  - optionIndex

DataTemplate2:
  - dataId
  - statement
  - imageId
  - correctAnswer
  - isExactMatch

AnswerTemplate2:
  - answerId
  - answer ?
  - isCorrect ?

DataTemplate3:
  - dataId
  - statement
  - imageId

DataTemplate3 - Relations:
  - dataId
  - leftStatement
  - rightStatement

AnswerTemplate3:
  - answerId
  - leftStatement
  - rightStatement

DataTemplate4:
  - dataId
  - statement
  - imageId

DataTemplate4 - Elements:
  - dataId
  - elementIndex
  - elementName

AnswerTemplate4:
  - answerId
  - isCorrect ?

AnswerTemplate4 - Elements:
  - answerId
  - elementIndex

Question - LearningStyle:
  - questionId
  - learningStyleId

Evaluation:
  - evaluationId
  - courseId
  - duration
  - evaluationType
  - grade
  - schoolId
  - title
  - week

Evaluation - Question:
  - evaluationId
  - questionId

Material:
  - materialId
  - courseId
  - grade
  - schoolId
  - syllabusId

Syllabus:
  - syllabusId
  - syllabusName

Syllabus - Week - Topic:
  - syllabusId
  - week
  - topic

Material - WeeklyTest:
  - materialId
  - weeklyTestId

Student - Evaluation:
  - studentId
  - evaluationId
  - classroomId
  - grade
  - schoolId
  - deadline
  - answerId
  - studentScore ?
  - submissionDate ?


Classroom - Evaluation:
  - classroomId
  - evaluationId
  - deadline
  - studentScoresAverage
  - studentScoresMax
  - studentScoresMin