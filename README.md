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
	
	KMStorage.isDefined('window.document.location.hostname')

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

<b>Create new instance of KMStorage</b>

	var tmp = {
		foo: 'foo',
		bar: 'bar',
		mydata: {
			name: 'my name is kmStorage',
			who: 'Mr.Park'
		},
		myarray: ['firstindex',2,'third index but realindex is 2']
	}
	var data = new KMStorage(tmp);


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
Unset data from object

	data.unset('bar');
	data.unset('myarray.1');


Now data\`s data is

	{
		foo: 'new foo',
		mydata: {
			name: 'my name is kmStorage',
			who: 'Mr.Park',
			groupname: 'Km-Studio'
		},
		myarray: ['firstindex','third index but realindex is 2']
	}

	* myarray.length still 3, but index 1(zero-based) is undefined

data's data cloned deep. when data's data is changed origin data is not changed.


<b>Method : isDefined</b><br/>
Check if exsits some propery of object

	data.isDefined('foo'); // return true
	data.isDefined('bar'); // return false
	data.isDefined('mydata.name'); // return true
	data.isDefined('yourdata.name'); // return false


Simply use without create new instance

	KMStorage.get(tmp,'foo'); // return 'foo'
	KMStorage.get(tmp, 'mydata.name'); // return 'my name is kmStorage'


Or You can get property of window object

	KMStorage.get(window,'location');
	KMStorage.get('window.location');
	KMStorage.get('location');

	* all commands return window.location


<b>Updates</b><br/>
	1.1.0
	
	1. Added flag for deep reference.
	var deepdata = new KMStorage([true, ]tmp); // After change deepdata, `tmp` will be changed as 	deepdata`s data.
	2.Separate from km`s core libarary and load km core if there is not ready km`s core library.
