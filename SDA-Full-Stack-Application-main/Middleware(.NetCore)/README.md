# Setting Up .NetCore and PostgreSQL Database

## Installation

### PostGreSQL Database
**Downloading Database**

Download PostGreSQL with Pgadmin4
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

**Setting up Database**

- Create Server 
- Host name: localhost
- Port: 5432
- Maintenance database: CloudPlusDB
- Username: admin
- Password: admin1234

**Potential Issue**

#### Unable to inlcude database CloudPlusDB 
1. Create server without maintainance database. 
2. Create database called CloudPlusDB
3. Right click server and add CloudPlusDB into maintainance database.
4. If unable drop the server and follow *Setting up Database*.


### .NetCore
**Downloading .Net**

Download .Net 5 sdk
https://dotnet.microsoft.com/download/dotnet/5.0

**Downloading Extension**

Download Extension in VCS marketplace

- C#
- C# Extensions
- NuGet Package Manager

**Setting up Netcore**

To ensure that your browser does not block netcore run this command. 

``` bash
dotnet dev-certs https --trust 
```

#### Adding Netcore packages
``` bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 5.0.2

dotnet tool install --global dotnet-ef

dotnet add package Microsoft.EntityFrameworkCore.Design --version 5.0.5
```

#### Linking .Net with PostGreSQL
- Delete Migration folder if any
- Ensure Database -> Schemas -> Tables is empty, else drop the tables.

``` bash
dotnet ef migrations add InitialMigration

dotnet ef database update
```

## Usage

- Run the .Netcore via Ctrl + F5 inside the development folder
- Ensure Pgadmin is running as well

## Configuration

### Configuring Limit Feature

```C#
/* Change the limit from AICamera.cs Line 27 */
private const int limit = 3; // Limit the amount of video that has been saved
```

## Testing 
- Go to https://localhost:5001/swagger/index.html to test that the Netcore is working. 

![](https://github.com/UGS-CS/2021-TEAM-21/blob/main/Wiki%20Images/ReadMe/NetCore.JPG)


