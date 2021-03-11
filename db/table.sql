CREATE TABLE Students (
id int IDENTITY(1,1000) PRIMARY KEY,
email varchar(255),
firstName varchar(255),
middleName varchar(255),
lastName varchar(255),
phoneNumber varchar(15),
dateOfBirth dateTime,
className varchar(10),
teacherName varchar(255)
);

SET IDENTITY_INSERT Students ON

INSERT INTO Students(id, email, firstName, middleName, lastName, phoneNumber, dateOfBirth, className, teacherName)
VALUES
(1000, 'j.smith@myschool.edu.gov.au', 'Jesse', 'M', 'Smith', '0404100200', '2007-02-11', '8C', 'Mr. Fincher'),
(1001, 't.jones@myschool.edu.gov.au', 'Todd', 'D', 'Jones', '0404200201', '2007-05-12','8D', 'Ms. Sprout'),
(1002, 's.evans@myschool.edu.gov.au', 'Sarah', 'G', 'Evans', '0404300202', '2006-12-17','8E', 'Mr. Burrows'),
(1003, 's.bellee@myschool.edu.gov.au', 'Sophie', 'A', 'Bellee', '0404400203', '2007-08-04', '8F', 'Mrs. Harkin')

SET IDENTITY_INSERT Students OFF

/* create 'contained' AAD user in Database server & grant datareader + datawriter roles */
CREATE USER [usera@kainiindustries.net] FROM EXTERNAL PROVIDER;
ALTER ROLE [db_datawriter] ADD MEMBER [usera@kainiindustries.net];
ALTER ROLE [db_datareader] ADD MEMBER [usera@kainiindustries.net];
/* ALTER ROLE [db_datareader] DROP MEMBER [usera@kainiindustries.net]; */
