#kmStorage
data manager


#Why kmStorage

When you create a project using javascript, you often need to check if the object exists.\n
If you work without checking then often error will occur with these messages.\n
	‘ReferenceError: `object` is not defined’ or ‘TypeError: Cannot read property 'property' of undefined’\n
Checking if object exists is simple. Such as ‘key’ in object or Function.hasOwnProperty(‘key’).\n
However, if you want to check if the object exists in multiple depth, it becomes a chaos. First you have to check if first object exists and check the second depth object and so on…\n
kmStorage will check if the object exists using depth identifier string. It can even check global window variable!!\n
The way to do it is simple as this!\n
   kmStorage.isDefined('window.document.location.hostname')\n

#Installation

Just include script

	<script src="/path/to/km.storage.lastest.js"></script>


#Methods

get\n
set\n
unset\n
isDefined\n
setsep: seperator for depth. default is '.'. if arguments is null return current seperator.\n


#Usage

Create new instance of kmStorage\n

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


Get data from object\n

	data.get('foo'); // return 'foo'
	data.get('mydata.name'); // return 'my name is kmStorage'
	data.get('myarray.2'); // return 'third index but realindex is 2'

	data.get(); // call get without arguments return all saved data



Set data to object\n

	data.set('foo','new foo'); // return 'new foo'
	data.set('mydata.groupname','Km-Studio'); // return 'Km-Studio'


Unset data to object

	data.unset('bar');
	data.unset('myarray.1');


Now data\`s data is\n

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

data's data cloned deep. when data's data is changed origin data is not changed.\n

Check if exsits some propery from object\n

	data.isDefined('foo'); // return true
	data.isDefined('bar'); // return false
	data.isDefined('mydata.name'); // return true
	data.isDefined('yourdata.name'); // return false


Simply use without create new instance\n

	kmStorage.get(tmp,'foo'); // return 'new foo'
	kmStorage.get(tmp, 'mydata.name'); // return 'my name is kmStorage'


Or You can get property of window object\n

	kmStorage.get(window,'location');
	kmStorage.get('window.location');
	kmStorage.get('location');

	* all commands return window.location

