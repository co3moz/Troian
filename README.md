Troian
===================

Another awesome template engine. It's small and effective to use. It really has a big potential.

Index
--------------
[TOC]

----------

Install
-------------

for install simply type this command.

```
npm install troian
```


----------


Abilities
-------------

#### • Lightweight

Troian is really small. it doesn't need any big dependency. 

#### • Developer Friendly

Developed views has simple comments. This action gives developer hints.

#### • Autorestart

When any file changed in view folder, troian automaticly re-compiles file. 

#### • Fast

It has special algorithm that makes some thing faster. 



----------


Examples
-------------------

You can find my example project at [here](https://github.com/co3moz/Troian-Example)

### Using it

First you need to require troian. Call it with directory function. This function reads directory and finds recursively troian files.  directory function returns object that has all files
```javascript
var troian = require('troian');
var template = troian.directory(__dirname + '/views/');
template.filename(); // renders "filename.troian" file
```
### Recursive folders

Troian has recursive folder reader. So if you need folders you can simply use access operator.

```javascript
var troian = require('troian');
var template = troian.directory(__dirname + '/views/');
template.index(); // renders /views/index.troian
template.partials.header(); // renders /views/partials/header.troian
template.a.b.c.d(); // renders /views/a/b/c/d.troian
```
### Template files
Template files designed as down below. troian tag are not required but it's highly recommended. You can give information inside of tag.
```ejs
<troian>
	Info
</troian>
```


### Code tags
If you want to specify some code, you should put it between `<%` and `%>` tags.
```ejs
<troian>
	Hello this is code tags example
</troian>
<%
	console.log("hello");
%>
```
if you want to print some thing on screen simply use `print` function
```ejs
<troian>
	Hello this is code tags example
</troian>
<%
	var a = 5;
	print(a);
%>
```
also you can use `<%(` and `)%>` tags too.
```ejs
<troian>
	Hello this is code tags example
</troian>
<%
	var a = 5;
%>
<%(a)%>
```
they do same job.

### Parametric templates
You can give parameters for templates. With parameters you can call views with variables.
```javascript
var troian = require('troian');
var template = troian.directory(__dirname + '/views/');
template.index(5);
```

```ejs
<troian params="count">
	count will be 5 and print 5
</troian>
<%(count)%>
```

Another big thing about parametric template files, you can define statics.
```ejs
<troian count="5" my_variable="hello">
	count will be 5 and print 5
</troian>
<%(count)%>
```

### Static field
Static field only runs one time. You can use this field for define unchangeable things or global things... It can be really usefull. As you can see down below, we just define count in static field and we simple do `count++` every request. 
```ejs
<troian>
	This view just counts.
	<%static
		var count = 0;
	%>
</troian>
<%(count++)%>
```

### Template Including
if we want to include some other template we can simply use `<%+(` and `%)>` inside we just give file name and paranthesis. this parathesis needing because all templates in troian are acting like function and has parameters.

index.troian
```ejs
<troian>
	This view is parent.
</troian>
<%+(child())%>
```

child.troian
```ejs
<troian>
	This view is chield.
</troian>
Hi master.
```

result 
```ejs
Hi master.
```
another example

-------------
index.troian
```ejs
<troian>
	This view is parent.
</troian>
parent:<%+(child(15))%>
```

child.troian
```ejs
<troian params="a">
	This view is chield.
</troian>
child:<%(a)%>
```

result 
```ejs
parent:child:15
```

### Template Including with Code
you can use template object for render another template.
```ejs
<troian>
	This view is template including with code
</troian>
<%
	var rendered = template.another(5);
	print(rendered);
%>
```

### Standard HTML codes for use
we developed simply html generator.. You can use them too.
```ejs
<troian>
	This view is Standard HTML codes for use
</troian>
<%(html.a("/link", "This is a link"))%>
```
or
```ejs
<troian>
	This view is Standard HTML codes for use
	<%static
		var link = html.a("/link", "This is a link");
	%>
</troian>
<%
	print(link);
%>
```