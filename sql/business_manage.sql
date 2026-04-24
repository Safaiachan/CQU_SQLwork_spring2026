CREATE TABLE IF NOT EXISTS department (
	did INT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	location VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS worker (
	wid INT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	age INT,
	gender VARCHAR(2),
	address VARCHAR(255),
	email VARCHAR(100) UNIQUE,
	salary INT,
	did INT,
	CONSTRAINT fk_worker_department
		FOREIGN KEY (did) REFERENCES department(did)
);

CREATE TABLE IF NOT EXISTS project (
	pid INT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	status VARCHAR(30) NOT NULL,
	did INT,
	CONSTRAINT fk_project_department
		FOREIGN KEY (did) REFERENCES department(did)
);

CREATE TABLE IF NOT EXISTS participate (
	wid INT,
	pid INT,
	role VARCHAR(50),
	work_hour INT,
	PRIMARY KEY (wid, pid),
	CONSTRAINT fk_participate_worker
		FOREIGN KEY (wid) REFERENCES worker(wid),
	CONSTRAINT fk_participate_project
		FOREIGN KEY (pid) REFERENCES project(pid)
);
