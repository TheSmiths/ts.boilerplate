# The Smiths Boilerplate
This tools allow us to bootstrap any kind of Titanium component or application with a complete test
and development environment. It can be used to create any kind of components (as defined
[here](https://github.com/thesmiths/thesmiths-widgets-hub.wiki)) or to simply bootstrap an app
extended with all tools described above.

## Behavior Driven Development 
Nowadays, create a mobile app is something that can be started quickly and quite easily. When using
a framework like Titanium, you're able to get a quick set up and to build something that is working
on android or ios in few seconds. This is great, nevertheless, as an app grows and becomes larger, a
non-structured project might evolve into a complete mess where each new feature brings additional
bugs. 
To avoid this, The Smiths are focusing on several important pointis; the first one is a behavior
driven development which means that, we specify the behavior expected by an app or a module - or more
generally, any kind of component - in order to then test this behavior and ensure that it is
conform.

To do such a thing, we are mainly using two tools.

### Calabash & Cucumber
[Calabash](http://calaba.sh/) is used to define smart understandable behaviors of mobile
applications. There are two versions of calabash: calabash-android and calabash-ios (names are
straightforward). Both version are APIs to interact with emulators, simulators or real devices.
Also, it relies on [Cucumber](https://cukes.info/) in order to offer an easy-to-read and
easy-to-write behavior syntax.  Finally, we are using our forked version of
[TiCalabash](https://github.com/ktorz/ticalabash) which allow developers to write behaviors that
supports internationalisation. Thus, it is possible to write test templates for every languages
using string references of the app. Here is a sample of what test scenarios look like :

```cucumber
Feature: Home Screen
  As an App Developer
  I want to see an example feature work on a default alloy app
  So that I can start using TiCalabash quickly.

Scenario: See Home Screen
    Given I am on the Home Screen
    Then I should see L('welcome_message')
    And take picture
```
### Jasmine
In order to also test core functionality like models or controllers behavior, we've choosen 
[Jasmine](https://jasmine.github.io) as a test framework. His syntax and the way it's allow developers
to describe scenarios suit perfectly the idea of behavior driven development. As an example, see the
snippet right below.

```javascript
this.Alloy = require("alloy");

describe("The main controller is doing his job well", function () {
    var indexController;

    before_each(function () {
        indexController = Alloy.createController('index');    
    });

    it("can be instantiated", function () {
        expect(indexController).toBeTruthy();
    });
});
```

## Continuous Integration
For large applications development - as well as for smaller apps - being able to ensure that any new
functionality doesn't break the current product is a concern that matter for both clients and
developers. Also, on the other hand, it would be great if all this verification process could be
self-operated. All our app can be built and tested automatically on [travis](http://travis-ci.org)
which is a well-known continuous integration tool that suits well with [GitHub](http://github.com).
Travis is able to grab new commits from GitHub and to launch a given build process; Therefore, it
supplies at the end a report and a status about the last build. 

Our builds are splitted in two kinds - *android* and *ios* - and are made on a *Mac OS virtual
machine*. Different SDK versions, simulators or emulators might be supplied, everything is working
the same way.


## Documentation
As every module and API shall be documented, that's why we've also integrated our forked version of
[JsDuck](https://github.com/ktorz/jsduck). With this tools, we can easily build powerful
documentation resources directly from the source code. Also, all these documentations can be
published to an external hosting service such as *gh-pages*.

## ts-boilerplate
Finally, we come up about the tool. The main purpose of this module is to grab and setup an
environment that could be used as a development base; Thus, calabash, jasmine, travis are
ready-to-be-used and ready-to-work. It will also setup a *git* environment with, for each libraries,
modules and widgets, 3 branches **master**, **doc** and **test**. Splitting aside tests and
documentation makes possible to import only core features of a component present on the master
branch.  
Using the ts-boilerplate to bootstrap a dev environment allow developers to focus on their work.
The only thing we have to worry about is the behavior we are expecting from our app, and how are we
gonna implement this behavior. 

### How To Install
Be sure to have your permissions correctly set. The module is gonna run some `npm install` and `gem`
commands without sudo. Having **Node Package Manager** and **RubyGems** installed is obviously 
required. 

If everything is okay, simply run : `npm install -g thesmiths/ts.boilerplate` 

By the by, nothing has been tested on *Windows* and the module would probably lead to unexpected 
behavior on this platform. 

### Command Line Interface
To start a new project, you can now use : 'ts-boilerplate init' which will ask you the *name* and
the *type* of project you want to setup.
Both information might be supplied as options : 
- `--name |  -n    <nameOfYourComponent>`
- `--type |  -t    <library|widget|module|project>`

At the root of a **doc** or **test** branch, you may find a `gulpfile`. Just use the `gulp` command
to display available tasks. Every project has also a similar file that allow you to build or launch
tests. 



