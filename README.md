# Overview

This is a simple, lightweight microblogging app, created as a learning project to improve my React skills. The core concept of the user experience is that a user signs in and once a day posts a short, 500-character max-length journal entry about their day. It can be very brief, such as a few cryptic words, a more specific recollection of an event from that day, or a simple summary of the entire day. In addition, they must include 1-3 tags for the entry. This is then time-stamped and geocoded before being written to the database.

The core of the app itself and the UI were built relatively quickly (probably about two weeks total, experimentation, meandering, and dead-ends included). However, when I began trying to link it up to Firebase things got... messy. I detail that more below, but the point is I threw my hands up and decided to rewrite it from scratch. To my credit, that _**very**_ brash and ill-advised move actually went pretty well. I was able to get all the core functionality of the app working in under two days. It was _ugly as sin_ but it did work. The remaining time from there was largely trying to get the UI to behave and then adding in some non-negotiable QOL things like, I dunno, being able to create an account (in addition to some more arduous debugging sessions, and one very ill-fated attempt to build a fancy entry card button menu).

There's a lot I still would like to do on this (see the to-dos below) but I'm comfortable with calling this an early alpha-ish build.

## Demo

If you would like to see a live demo of the app, I have one hosted on Firebase right now. Just [click here.](https://bonjournal-360318.web.app/) Just select sign-up, fill out the form, and you can begin creating posts. Feel free to let me know if you notice any bugs (that aren't related to viewport sizing, I am EXTREMELY aware of those). The more of them I know about, the more of them I can address.

## Setup

If for whatever reason you want to stand up your own instance of this app, it's simple enough.

### Prereqs

You will need:

1. Git
2. Firebase account
3. Firebase Auth
4. Firebase Realtime Database
5. Google Maps (optional)

### Steps

1. Clone the repo
2. Run yarn add / npm install
3. Replace the config file API keys with your Firebase API key and your Google Maps API key (optional if you please)
4. Upload it to your Firebase app (with Realtime Database and Auth services enabled)
5. Go wild

### Google Maps Setup (optional)

_TBD_
(I haven't touched that code in a while, I will need to go back in and check how exactly to re-enable that function)

# About the App

## Stack

This app simply makes use of React with Firebase acting as the backend. Future iterations of the app will move away from Firebase, and introduce a Node backend, an SQL database, and a few frameworks / libraries to tie it all together smoothly.

A notable point in this app is that I actually avoided their SDK entirely - not out of any dislike or functional requirement, but rather for the sake of honing my own abilities. In a realistic scenario I'd just use the authentication functions they themselves provide, but I was looking to learn, not build the most efficient app in the least time. And I think that was the right call - having to build out your own session management is an involved process, and I got some great experience with managing timestamps and (in particular) cookies.

The same goes for the API calls. I'd gotten pretty stale on promises and in the course of writing all those backend fetch() requests I really polished up on them. I'll cover that more further on, but my point here is that: eschewing pre-made tech is a poor business decision, but a _fantastic_ educational one. You don't need to build everything from scratch (and you should avoid it), but you can learn so much from doing so.

I also just want to put a big disclaimer in here: I am not a visual design kinda person whatsoever, so I mostly have stuck to Material and some CSS palette generators. If the colors aren't appealing or the layout isn't the prettiest, well - that's what happens when an API and integrations guy is asked to concoct a front-end design. Feel free to write up a stylesheet if you actually have a knack for that kinda thing, otherwise don't @ me, I know it's not pretty.

Another quick callout: I've disabled the reverse geocoding on this since keeping that API key secret via Firebase would involve binding my app to Firebase far more than I am prepared to do. I don't intend to stick with it forever, so expending time learning how to and then building my own functions just does not seem like a good use of my time. Feel free to include it in your config if you like however.

## Functionality

The user stories in play right now are (all of these prefaced with an assumed "as a user"):

-   _"I want to sign in to my account"_
-   _"I want to update my account info"_
-   _"I want to create entries"_

And of course, all the things that logically follow from those like field validations and creating tags. I could list out every single thing it can do right now, but that seems fairly excessive, so I will leave it at "CRUD for entries and tags, CRU for accounts." Pagination is also currently not implemented - again, if I'm creating my own backend, I don't see much point in creaing more functionality I will have to refactor in the near future.

## Limitations

-   **Name:** Apparently I have a branding issue on this, as people seem to consistently think it's some kind of food-blogging related app?? But whatever, this isn't any sort of production app so branding isn't exactly important
-   **Visuals:** I believe I noted above that I am in no way a graphic design person. My visual imagination has been kneecapped since I was like 16 and things like color schemes and such are just not a strong point. I operate on the assumption that in developing any real application there would be someone whose job it would be to make the app actually, y'know, look okay.
-   **Password Resets:** Currently there is no way to change an account's password
-   **Security:** Within the UI you wouldn't have the ability to access other users' data. However, this is not really enforced in Firebase. I did research how I could acomplish this (it's actually very easy) but considering I'm replacing Firebase in the future I didn't see too much point in the effort when I'd have to just replicate it in my own backend.
-   **Loading:** The app doesn't currently utilize pagination. At this scale it isn't a big deal, but as posts increase, performance will eventually take a hit.
-   **Search:** I originally wanted to include this, and it is a part of the first iteration that runs purely on browser storage. However, the way the Firebase Realtime Database works discouraged my implementation of it beyond just searching tags. This got compounded by some issues in Material UI's autocomplete component, and ultimately led me to shelve the effort for the time being. A custom backend should resolve this.
-   **Accessibility:** Presently the app has very little in the way of accessibility.
-   **Usernames:** Usernames don't actually do anything, I included it mostly to tinker around with forms.
-   **Visuals:** There are some notable UI issues, chiefly with scaling. It is a combination of not having breakpoints for viewport sizes, and a more general laxness in the layouts. They don't really break base usability on a desktop browser, but I do have an intent to revisit them at some point in the future.
-   **States and Prop-drilling:** scrapping context for everything except authentication resulted in storing everything in state high up in the app, and utterly ruthless prop-drilling. I \***\*REALLY\*\*** do not like this. Following the first pass on the backend, this might be the top of my list to address. It just makes for really messy code, and makes changes especially difficult to enact.
-   **Darkmode:** Trying to include Material UI's darkmode themeing caused the app to crash more or less instantly. For the time I've abandonned it. The styling is present, and could be accessible, but I was forced to comment it out. Given it is a purely aesthetic thing, it is rather low on my priority list given the other issues I've got on deck.
-   **Documentation & Commenting:** I did try to be a responsible programmer at first and properly comment all the code via JS Docs. You can still see evidence of this in a few files. However, I ran into repeated issues where it didn't actually _do_ anything, and the searches I did only turned up solutions that were not applicable to my project or which were extremely sophisticated. There seems to be a real gap between the very base level stuff like identifying functions and parameters, and doing really fancy stuff. So... yeah. All that notwithstanding, I did put in some general comments to try and give insight into what is happening where (though I will confess I did slack off in some places, especially towards the very end). So, apologies there. It's something I'd like to revisit sometime.
-   **Images:** Another feature that I do want in there eventually is the ability to upload pictures. I consider this feature very low priority by comparison.
-   **Errors:** This is a QOL one that is very bad, and high up on my list of next improvements. Currently very few actually display in the UI - really, only field validations show these messges right now. This needs to be adjusted. There are also some _very_ strange errors out of Material UI. Their documents and React seem to conflict on how certain props should be handled, with react throwing very angry errors into the console when you follow the Material UI docs. Even worse, these aren't consistent? Like, sometimes it gets mad at, say, passing a boolean into a prop. Other times it just does not seem to care. I haven't pinned down what causes this irregularity, but I do find it very frustrating and I wish they would just decide up front one way or the other how they want these things passed into components.

I may come back and add to this list in the future. To be clear, there is a ton of stuff I'm unhappy with or which needs changes/improvements/overhauls. This is a very early version of this, and carries all the baggage that implies. So expect changes as I run into more limitations in the future.

# Major Learnings

This is, first and foremost, a project for growing my own skills and knowledge. So, naturally, a big focus on this has been doing personal retros, and seeing what went wrong, what went right, why it played out how it did, and what those outcomes tell me about how I can do things better in the future.

### Don't overthink your userstories

I just went way too far with user stories. Like, you don't need one for your each and every button. I didn't go quite that far, but I also didn't do it in a sane way. After abandonning the original set, I finally settled into a couple of much broader ones - I think about 6 or 7 total by the end (I added a few in later on, namely the two around signups and user profiles), and I found this number far more serviceable.

### Be flexible with your tickets

One of my earliest mistakes was spending several hours (read: better part of a day) drafting up a very, uh, "passionately" (read: concerningly) detailed product brief. xtremely in-depth user stories down to utterly unnecessary levels of specificity (as prev. noted), mountains of epics, and way _way **way**_ too many tickets. For a project this size, it was spectacularly overengineered. It's a learning project, not an operating system.

Needless to say, I abandonned that tracking system and its ocean of tickets more or less immediately in favor of a much more lightweight system. I whittled the user stories down to a handful and began using much broader category tickets, only getting super specific when it came to bugs. This was the right move. As opposed to overbearing I found it actually very convenient, and without straying into the territory of overly vague and leaving my unfocused.

I think my main improvements to it might be sorting them by some broader category, such as epics or larger functionality sets - as well as some better visual markers in Notion so I can better parse them at a glance.

### Put useful search results in an index

I'm not sure why this one took me until the end of my 20s to start doing, but in this project I began saving links (grouped by general topic in the app) to various search results I found when trying to find solutions to issues. Stack Overflow, blogs (Geeks For Geeks are really fantastic, highly recommend those folk - they seem to cover everything generalizeable and have excellent quality), and any MDN entries I found myself frequently revisiting.

It's a small thing to do, but it solves a huge issue of mine in the past, which has been finding answers to things and then never being able to find them agian. I think I only revisited a few of these pages over the course of the project, but I'd rather have them on hand then find myself in a year or two time tearing my hair out trying to find that amazing function I found that one time.

### Firebase embodies a clear app design philosophy

Towards the end of this first iteration of the app, I increasingly found myself fighting against Firebase rather than just leveraging it. While Auth was a breezy experience, the Realtime Database began presenting increasingly more severe limitations as time went on. For instance, I had to entirely whittle down the scope of the search functionality (before axing it due to Material UI-related issues). The original plan was being able to search by tag, text content, date range, and location. While Realtime Database would allow me to do one or two of these, more than that would be particularly onerous to do in any way that involved pagination. I could have just loaded _every single_ post and then do all the filtering on the client-side, but this would be a short-term stopgap and in no way scalable. Something that could be accomplished with a relatively simple SQL query ballooned into an arduous undertaking.

Another issue was in how the REST API calls

Now this might come down to my own understanding of it, but more the impression I get is that it is heavily geared to a certain kind of use case and a certain design philosophy - and if you fall outside the bounds of that you will find yourself battling uphill against that philosophy. There's nothing wrong with that philosophy, but it doesn't align well with what this app is trying to do.

### Context is a cruel mistress

The original plan was to have the entire app operating on Context. Keep it consistent, and clean. You might notice: _the app in its current form does not do this **at all**_. Why?

Well, when I plugged the original build of the app into Firebase things went sideways, and _fast_. The moment the context was being fed by async functions everything broke. At this point I might feel a little more confident tackling that issue, but at the time it seemed utterly inscrutable. I tried solution after solution after solution, to no avail. I even brought my partner (themselves an eningeer) in to take a look and it didn't get me too far.

At a certain point, the app was a mangled mess of failed solutions and half-baked ideas. It got rendered totally unreadable, and I concluded I would solve it faster by starting form scratch than bashing my head against that first iteration any furhter.

This also leads neatly into my next lesson...

### Remember to frickin' commit

Part of the reason I abandonned the first version was because, in my desperation and hyper-fixation, like a moron, _I FORGOT TO COMMIT_. So I just couldn't undo anything I'd done. Cool. Which is weird too, because I'd actually been pretty good about it up to that point. I suppose the stress and frustration manifested in some tunnel vision to my own detriment. Not much else to say on that other than "I need to really keep that in mind." My intent is to have future versions of this going forward be much more intentionally set up in Git.

### Promises everywhere

The original iteration of the app was _highly_ synchronous, a characteristic which enthusiastically participated in the Context Catacylsm I ran into. Going into the second version, I opted instead for far more promisification and granaular functions, which served me very well in the API requests. Notably I couldn't switch to promises entirely, and there are still some callbacks floating around where I'd prefer there not to be.

Specifically, context in react makes for some really wonky patterns in the authentication, as I have yet to find a way to let me access the auth context _outside_ of a react component or context itself. I could have left a bunch of these functions in the same file as the auth context, but that would have been grotesquely bloated and exhausting to read. I felt leaning on some callbacks and _technically_ unnecessary function parameters was an acceptable tradeoff readability-wise. I do intend though to tackle this issue again in the future, likely through some OOP for the utils files.

# To-Dos

This is a very early iteration of the app. I built it not to be the prettiest and most efficient bit of code around, but to be a good learning sandbox (and boy was it). This version of the app simply represents what I consider to be an acceptable demonstration of core functionality. There are so many areas of potential improvement, and below are most of the major ones. They can be roughly categorized as:

1. **Front-end improvements** - There are a bunch of improvements to be made on the fron-end of the app. These range from very dreary tasks (like standardizing how promises get used and standardized error messages) to far more significant refactors (like replacing a state with a context).
2. **Back-end development** - Some front-end improvements are contingent upon building my own backend. On the one hand, I want to do this for learning purposes and doing the whole full-stack thing. On the other hand though, some of these are to address constraints from Firebase.
3. **Features & Quality-Of-Life** - There are some fundamental bits of functionality I'd like to add in to the app, some of which are just experience improvements (loading indicators), others representing entirely new user stories (search). For the moment, focus will be on the QOL ones.
4. **Process** - Lastly, I've got some changes to how I actually go about doing all of this that I would like to enact. Think a more formal version of my down-scoped epics and tickets, that sort of thing.

So, let's get into it...

## Overhaul Management

For future versions, I want to actuate the lessons I learned from my first pass on managing/tracking my project. Simpler user stories, more general tickets, better categorization, etc. I don't want to be touching my tickets every 5 minutes, nor do I want to be neglecting them for an entire day, and I think I settled on a good pattern a few weeks ago that I'd like to structure better for the future.

## Unmangle Git

This is the real embarassing one. Emotions ran high. Focus shifted. Iterations got scrapped. Git suffered - badly. Going forward, I want to discipline myself on it and using it _correctly_.

## Password Change

I began putting this in, but realized it would require a not-insignificant set of changes to my orchestration functions. This is another gift from Firebase where I need to string on _another_ sequential API call to update the password. So, if someone changed email, password, and their name it would be three sequential calls and two updates to the auth context. Yeesh. It wasn't in my original scope (due to just not thinking of it more than any intention), and so I felt comfortable leaving it out for the time being. But the code is partly there, I just need to make some adjustments, but it is gonna be part of my next update (or should be, at least, presuming no curveballs).

## Loading Indicators

This is another top-priority fix. Currently when you submit an entry, it just seems to... stop. Nothing happens. Then suddenly a few seconds later the entire UI updates. It's long enough that someone could start trying to edit and update the entry they just submitted. I need to implement loading indicators in relevant locations, and I need to do so pronto.

## Error Messages

Errors may be the single area where I failed the worst relative to my original intentions. I originally aimed to have some very nice and helpful error messages and alerts. Over time though, my focus zeroed in on core functionality and troubleshooting and the error messages ended up abandonned. I intend to promptly remedy this.

## Standardize Errors

Following on the point above, errors are very irregular. You can see this front and center in the API calls, where every single one seems to have a different way of formatting errors. Not cool, must fix.

## Refactor Forms + Fields

These components are kind of a mess. I wasn't sure how I wanted to build all of these at the outset, and so tinkered around a bit and.... well, it does show. Especially with field validation. There's just a ton of repeated and overly verbose code. A big change I want to do, possibly even before I tackle the backend, is to create a much more reusable, generalized system for forms, fields, validations, and submissions. I think I can abstract out quite a bit and tighten the code up a ton. I think my brain might be rotting but I actually look forward to tackling this one?

## Unit Testing

There's no testing going on here. I just haven't had the bandwidth to focus on getting that set up. Instead I've tried to rely on keeping things granular and working on one bit at a time. For now, this is viable, but as the app grows in complexity I will need to start using a more scalable approach.

## Backend

This is just gonna be a beast, but essentially I intend to build out a custom backend for this whole thing. Reason A is to, again, learn and grow my skills. Reason B however is to build an API better suited to what I'm trying to do - and especially one that can handle searches better.

Don't mistake that brevity - this will be a mondo undertaking that I've only just begun sketching out.

## Refactor Database Calls

The database calls work fine, but there's a lot of inconsistencies and a lot of repetitive code I can streamline.

### Standardize Promises

It tooks a while before I finally settled in on a pattern of using promises (best embodied in the tags util file), and as a result there's a bit of experimentation littered throughout the code. I want to go back over it and get it all into a standard pattern, to improve maintenance, writability, and readability.

As a side note: I went with promises over async/await as a largely aesthetic choice. I much prefer the way they read, personally. I've also been using them far longer (since about 2015/2016 or so?), and they feel far more familiar to me.

### Standardize Function Patterns

The code repeats itself a lof in the fetch calls, so there's a lot of room for improvement in there.

## Search

If it isn't clear by now: I am really disappointed I couldn't get this in the initial version here. I think part of it is how pleased I was with the code I wrote for it in the original, local-only version of the app. It was comprehensive, effective, and built with future extension of functionality in mind. And I had to just abandon that because Material UI and Firebase had to be problem children. It is pretty much the first thing I want to add in once the backend is working. Goal is to be able to search your entries by date, location, tags, and text content. If I ever get around to doing any kind of social aspect to it, posts by user will also make an appearance (big if there).

## Auth Context Improvements

I intend to look into ways to smooth out the auth context. It is very clunky in a lot of places, and I think there's serious room for improvement.

## Entries Context

This is a huge one I want to get in there. I detailed this in the limitations but basically I had to rip out the context I was previously doing in favor of state due to some async chaos that unfolded. I want to reimplement it badly however, as the current prop-drill decadence needs to be stopped. It clutters the hell out of the code, and there is no reason for it to do so.

## Tags Context

This is a bit more recent of a decision, but the moment I began looking into doing tag searches with database calls I realized there was enough going on with the tags that it made sense to build a context for them. They get accessed in a ton of places and have some very notable logic going into them and their relationship to searches and entries. It's slightly lower priority than the entry context, but it is definitely on my list.

## Limit Post Frequency

The original idea of this was "one post per day" which is currently in no way enforced. This is more out of development convenience than anything else. Frankly, it will probably be one of the last things I implement for that reason (though I suppose I could do some sort of dev mode to work around that, but that would just make too much sense).

## Dark Theme

Noted previously, dark mode is defined in the MUI themeing, but doesn't work for reasons I haven't had the time to really investigate. Given its minimal impact on the app, it's pretty low priority, but it is on my radar.

## Fancier Entry Controls

This is very much a "nice-to-have" sorta thing, but I want to try and get the entry controls into a menu that expands out of the timeline dots (as opposed to being on the entry card itself). This has some serious challenges around the MUI timeline flexboxes cause things to get really ugly in a hurry. Someday. Someday.

## Reverse geocoding but make it safe

I'm excluding the reverse geocoding for now because of the unnecessary work I'd need to do in Firebase that I would then need to scrap to do in my backend anyway. Basically if I did it now, the API key would be exposed for literally anyone to just snag from their network tab and start pounding my account (and my credit card). Future state is to have this handled properly on the backend as an environment variable. For now, the logic is disabled. Mind you, it does work. Feel free to pop a Google Maps API key in there and give it a whirl if you like.

And that's it for this readme. If you made it through all of that, uh... congratulations? Why are you reading this that much? Do you need help? Sssshhh, don't worry, you don't need to say anything, just blink twice if you're in dang-

## Accessability

I need to do some audits and improvements on accessibility. To now I have pretty rudely neglected it, so I will need to go back and rectify that.
