#kmStorage
data manager


#Why kmStorage

When you create a project using javascript, you often need to check if the object exists.<br/>
If you work without checking then often error will occur with these messages.<br/>
      
	‘ReferenceError: `object` is not defined’ or ‘TypeError: Cannot read property 'property' of undefined’
	
Checking if object exists is simple. Such as ‘key’ in object or Function.hasOwnProperty(‘key’).<br/>
However, if you want to check if the object exists in multiple depth, it becomes a chaos. First you have to check if first object exists and check the second depth object and so on…<br/>
kmStorage will check if the object exists using depth identifier string. It can even check global window variable!!<br/>
The way to do it is simple as this!<br/>
	
	kmStorage.isDefined('window.document.location.hostname')

#Installation

Just include script

	<script src="/path/to/km.storage.lastest.js"></script>


#Methods

get<br/>
set<br/>
unset<br/>
isDefined<br/>
setsep: seperator for depth. default is '.'. if arguments is null return current seperator.


#Usage

<b>Create new instance of kmStorage</b>

	var tmp = {
		foo: 'foo',
		bar: 'bar',
		mydata: {
			name: 'my name is kmStorage',
			who: 'Mr.Park'
		},
		myarray: ['firstindex',2,'third index but realindex is 2']
	}
	var data = new kmStorage(tmp);


<b>Method : get</b><br/>
Get data from object

	data.get('foo'); // return 'foo'
	data.get('mydata.name'); // return 'my name is kmStorage'
	data.get('myarray.2'); // return 'third index but realindex is 2'

	data.get(); // call get without arguments return all saved data


<b>Method : set</b><br/>
Set data to object

	data.set('foo','new foo'); // return 'new foo'
	data.set('mydata.groupname','Km-Studio'); // return 'Km-Studio'


<b>Method : unset</b><br/>
Unset data to object

	data.unset('bar');
	data.unset('myarray.1');


Now data\`s data is

	tmp = {
		foo: 'new foo',
		mydata: {
			name: 'my name is kmStorage',
			who: 'Mr.Park',
			groupname: 'Km-Studio'
		},
		myarray: ['firstindex','third index but realindex is 2']
	}

	* myarray.length still 3, but index 1(zero-based) is undeinfed

data's data cloned deep. when data's data is changed origin data is not changed.


<b>Method : isDefined</b><br/>
Check if exsits some propery from object

	data.isDefined('foo'); // return true
	data.isDefined('bar'); // return false
	data.isDefined('mydata.name'); // return true
	data.isDefined('yourdata.name'); // return false


Simply use without create new instance

	kmStorage.get(tmp,'foo'); // return 'new foo'
	kmStorage.get(tmp, 'mydata.name'); // return 'my name is kmStorage'


Or You can get property of window object

	kmStorage.get(window,'location');
	kmStorage.get('window.location');
	kmStorage.get('location');

	* all commands return window.location

