Installation
================
You do not need to install NodeWire Dashboard in order to use it. You can use the cloud hosted dashboard by visiting s2.nodewire.org.

But if you want to run it locally, you can start by cloning this repository. And then editing the .evn file to set the address of the (api) server you want to connect the dashboard to (either s2.nodewire.org or localhost).

After that you can run the dashboard as follows:

```bash
npm install
npm start
```

Getting Started
=========
NodeWire Dashboard is used to build xml based interactive user interfaces. It supports all of html tags and can directly interact with Nodes. Variables can be attached to attributes in order for the values of the attribute to be supplied by the variable. 

For example,

```html
<div>
    <script>
        count = 0 
    </script>
    Counted: <span>expr:count</span> 
    <button onClick="action:count=count+1">
        increase
    </button>
</div>
```

The script tag allows you to initialize the variable, count, that you are going to use later in the page. Scripts are written in DF, a version of python created for NodeWire.
Only a rudumentary version of DF is implemented on the frontend for now.

Next, the span element displays the value of the count. To display any value, user "expr:", followed by the name of the variable or an expression. In additon to tag contents, you can also use "expr:" to set the value of attributes. e.g.

```html
<div>
    <script>
        c = {color: 'red'}
    </script>
    <span style="expr:c">hello</span>
</div>
```

Finally, use "action:" to create event handlers. Actions are always assignment statements. Note that you may have to reload the page prior to adding new actions, otherwise it might not register correctly.

```html
<div>
    <script>
        c = {color:'red'}
    </script>
    <span style="expr:c">hello</span>
    <button onClick="action:c={color:'blue'}">blue</button>
    <button onClick="action:c={color:'red'}">red</button>
</div>
```

or

```html
<div>
    <script>
        c = 'red'
    </script>
    <!--todo: make this work-->
    <span style="expr:{color:c}">hello</span>
    <button onClick="action:c='blue'">blue</button>
    <button onClick="action:c='red'">red</button>
</div>
```
or

```html
<div style="expr:c">
    <script>
        c = {color: 'red'}
    </script>
    <!--todo: make this work-->
    hello
    <button onClick="action:c.color='blue'">blue</button>
    <button onClick="action:c.color='red'">red</button>
</div>
```

Handling Events
=========
the "when" statement is used to monitor and handle events. There are two types of events. Timer events are periodic events generated by using the timer object. The time object returns the number of seconds since January 1, 1970.

Similarly, time.seconds returns the current second, while time.minutes returns the current minute. To generate a periodic event, you use the time object in a when statement:

```html
<div>
    <script>
        count = 1
        entered = 0
        when time.seconds:
            count = count + 1
            print(count)
    </script>
    <div>expr:count</div>
    <input change="entered" value="expr:entered" />
    <button onClick="action:count=int(entered)">set</button>
</div>
```

Note the special attribute "change", which is used to specify the variable that should receive the values entered into the input box.

You can apply this to attributes too:
```html
<div>
    <script>
        c = 'green'
        when time.seconds:
            c = 'red' if c =='green' else 'green'
    </script>
    <p style="expr:{color: c}">expr:c</p>
</div>
```

Nodes
==========
You can create nodes that can communicate with other nodes in remote devices, microservicers or other browser instances.

To create a node, call the Node function and provide a list of the input and output port names

```html
<div>
    <script>
        k = Node('test', {inputs:'start reset', outputs:'count'})
        when time.seconds and k.start==1:
            print(k.count) 
            k.count = k.count + 1
        when test.reset or 1:
            log('changed')
            k.count = int(test.reset)
    </script>
    <span>expr:test.count</span>
    <input type="text" value="expr:test.reset" change="test.reset"/>
</div>
```
Note that you can refer to a node by its variable name or by its nodename.

Now open another browser instance and create the following script to talk to the node above:


Connect to a Node
------------

```html
<div>
   <script>
       getNode('test')
       test.reset = 1 
       test.start = 1
       when test.count == 10:
           test.reset = 0
   </script> 
   <div>expr:test.count</div>
</div>  
```

In the above two examples, we used another type of signal, namely variables or ports (e.g: k.start, test.reset and test.count). When used in a when statement, this variables trigger the statement whenever their values change and the expression of the when statement evaluates to a true statement.

Access Object properties
========================
```html
<script>
    them = [1,2,3,4]
    k = {name: 'ahmad', numbers: them}  
    print(k) 
    print(k.name)
    print(k.numbers[2])
</script>
```

List
====
```html
<div>
  <script>
      people = [{'name': 'Ahmad'}, {'name': 'Rashaad'}, {'name': 'Habeeb'}]
  </script>
  <div>expr:people[0].name</div>
  <ul channel="expr:people" iter="i" >
    <li>
        expr:people[{i}].name
    </li>
  </ul>
</div>
```

Dynamic List
```html
<div>
    <script>
        people = ['One', 'Two', 'Three']
        when add:
        	people = people + add
    </script>
    <div>
        <input type="text" value="expr:value" change="value"/>
    </div>
    <button onClick="action:add=value">add</button>
    <ul channel="expr:people" iter="i" >
        <li>expr:people[{i}]</li>
    </ul>
</div>
```

formgroup
==========
<FormGroup>
  <FormControlLabel control="component:{Type:'Checkbox', defaultChecked:'1'}" label="Label" />
  <FormControlLabel disabled="1" control="component:{Type:'Checkbox'}" label="Disabled" />
</FormGroup>



Components
==================

 <SvgIcon>
   <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
</SvgIcon>