## Summary

This app sends a notification to my phone when a team of my choice across the world scores a goal.

I use twilio's API to hook up to my phone and I scrape the data i need with cheerio from https://livescore.football365.com/football/live.


## How it works

1# 

First I have an anonymous function with a set interval function which fires every 1:30 minutes.

Within the anonymous function I get the data I need to scrape with by sending a post request with fetch.

This post request is made by the football365 API when there are more than 42 teams playing live.

I found it on the google network were you can keep track of all the requests going on in the background.

I used the copy fetch option that appears when you right click on the request, which copies the whole request including all the headers
and the body.

If I was to simply send a request to the main endpoint https://livescore.football365.com/football/live I would only be able to
access the first 42 live games and does not deal with the infinite scroll.


2#  

When I send my post request, I get all the data I need to scrape with and send it through to my next function.

In this function I simply scrape all the data that I want which includes the goalscorer, home and away teams, and scoreline.

To get this data I need to collect all the hrefs of certain games, because I won't be able to get the goalscorers, only the results.

When I get a list of all the hrefs, I filter the href by the parameter I pass into the function for this example i will use everton.
so now we have one href which refers to the everton match.


I then make a request to the same endpoint but attach the team hfef to the end which now allows me to scrape data from the exact match
I want and can get access to the goalscorers!

I can now save the data I need to variables using cheerio.

All the data comes back okay except for the goal scorer data.

So I need to use a lot of regex logic to format it probably.

Once I have formated all the data I need, I put it all in an object which I am going to send to my next function!


3# 

This next function's job is to wait until a goal has been scored and then send the data to my last function, which actives my whatsapp and sends the data.

How I do this is I compare two arrays of goalscorers. 

Two arrays of goalscorer are getting compared each time by its length, for example.

Its Everton 0 vs LIverpool 0

So the two arrays would be empty

[[] , []]

Now let's say everton score

We have to wait until the goalscorer is in the data which takes about 1 minute after the goal was scored
once it shows we will now have:

[[39' lookman] , []]

One array is now a different length to the next and that actives my if statement which will active when array length are not equal.

Then the last function gets activated and the last thing I do is i shift off the array so it goes back to comparing arrays but now it
will look like this:
[[39' lookman],[39' lookman]]

So both arrays will be the same length again and will not activate my if statement.

And I also pop of the array when both are equal so there are always two arrays getting compared.

4#

The last function simply sends the message to my phone when we have the goalscorer data sent from the 3rd funcion,
and voila I get a notification telling me the latest score and the goalscorers!





