
use 'npm install first then npm run start' in terminal

all users roles can access the member page 
only members cannot access staff pages


ogin details:

user : figos
password : abc123   
access : admin

user : sien
password : abc123
access : trainer

user : jasper
password : abc123
access : memberl


//auto copy-paste
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Homepage</title>
        <%- include("partials/head.ejs") %>
    </head>
 <body>
        <main>
        <%- include("partials/header.ejs") %>
	<section>

	</section>
    
     <%- include("partials/footer.ejs") %>
    </main>
    </body>

</html>

<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Homepage</title>
        <%- include("partials/head.ejs") %>
    </head>
 <body>
        <main>
        <%- include("partials/member_nav.ejs") %>
        <%- include("partials/staff_nav.ejs")%>
	<section>

	</section>
    
     <%- include("partials/footer.ejs") %>
    </main>
    </body>

</html>