# ************************************************
# CREATE DATABASE COURSE
# ************************************************
Rails.logger.info "\n\n***** STARTING COURSE: Databases *****"

course_position = 3
section_position = 0
lesson_position = 0

course = create_or_update_course(
  title: 'Databases',
  description: ' Databases are used to organize and capture large amounts of data, typically by inputting, storing, retrieving and managing the information. This course will focus on relational databases, which are widely used to store data and SQL, the language used to query the database.',
  position: course_position,
  identifier_uuid: '5038bddf-c121-4e92-8c68-dd34008b7ca0',
)

puts course.position

# +++++++++++
# SECTION
# +++++++++++
section_position += 1
section = create_or_update_section(
  title: 'Databases',
  course_id: course.id,
  position: section_position,
  description: 'Rails does a lot of the heavy lifting with connecting and querying a database but there will be times you need to tweak a query to the database using raw SQL. Learning how to query efficiently will help your understanding of what Rails helps abstract away.',
  identifier_uuid: '2fd5cf3b-746e-442c-92b5-9871c1fc9fdb',
)

lesson_position += 1
create_or_update_lesson(
  title: 'Databases',
  description: "Here you'll learn the basics of databases and how they store data.",
  position: lesson_position,
  section_id: section.id,
  is_project: false,
  url: '/databases/database_basics_lesson.md',
  identifier_uuid: '567f9db4-655c-4df9-9de2-71fc8cfbf391',
)

lesson_position += 1
create_or_update_lesson(
  title: 'Databases and SQL',
  description: "Data is the core of every major web app and here you'll learn how to speak SQL. Being able to properly query a database will go a long way to minimising any problems your website's users might encounter with slow response times.",
  position: lesson_position,
  section_id: section.id,
  is_project: false,
  url: '/databases/databases.md',
  identifier_uuid: '60439aa4-1f12-49e2-8cc9-515574e2ad71',
)

lesson_position += 1
create_or_update_lesson(
  title: 'SQL',
  description: 'The best way to learn is by practice, so this project will give you plenty of opportunity to apply your new SQL powers (for good).',
  position: lesson_position,
  section_id: section.id,
  is_project: true,
  url: '/databases/project_databases.md',
  accepts_submission: true,
  has_live_preview: false,
  identifier_uuid: 'a4baeee4-7bab-47ba-8157-c8f52b204734',
)
