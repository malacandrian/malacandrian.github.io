---
layout: post
categories: recipe
---
I'm not about to claim that recipes are awful, they clearly work in some form, and have done for [potentially thousands of years](http://en.wikipedia.org/wiki/Recipe#History). But they're certainly not optimal: they seem to be designed for describing out loud, require significant domain-specific knowledge, and give very little useful information at first glance. Let me demonstrate this with a story.

Last week I was trying to cook pancakes. My previous attempt had been quite dense, so before beginning, I Googled "[Fluffy pancake recipe](https://www.google.co.uk/search?q=fluffy+pancake+recipe)". All the recipes had two things in common.

1. The all suggested I sour the milk before mixing it with the dry ingredients
2. None of them said why

I've only ever soured milk accidentally before: forgetting before adding vinegar to a dairy sauce, and that always ruins the meal. I needed convincing that this was a good way forward, and none of these make any attempt to persuade me of this. None of them explain what I'm trying to achieve by souring the milk, or why that might make my pancakes fluffier. These are the important questions that I need answering, it's why I'm looking at recipes in the first place. Through some further Googling I managed to work out that one sours the milk as a substitute for buttermilk. I still don't know why buttermilk makes fluffier pancakes than regular milk.

My first instinct is to echo Sam Hughes' cry to [comment your code](http://qntm.org/cookery), but this is a fairly superficial patch. How do recipe writers know which lines should be commented, and which can be assumed? How often do you need to redefine a verb? Most people who use recipes know how to cook, and more importantly know how to use recipes; why should recipe writers waste time explaining simple things over and over for people like me who only use recipes as a springboard? 

Technical language and assumed domain-specific knowledge are good things: they allow for simpler, more efficient, and more accurate communication between insiders. It's why it exists, and it pervades all communities [despite every effort to eliminate it](https://www.google.co.uk/search?q=how+to+eliminate+jargon). The problem with such jargon comes when you're an outsider, when you don't know all the nods and winks. For outsiders this presents additional barriers to entry, as there are things you need to understand before you can start understanding things.

The solution to this is not to eliminate jargon, that restricts experts' ability to operate within the field, and simply isn't going to happen. The solution, rather is to make the knowledge accessible. Commenting your code is one way to do that, but it's not the only way. It's not even the only way computer science manages it.

I think the recipes -> programming metaphor is useful. They're both a series of instructions followed to achieve an aim, [in fact it's a metaphor often spun the other way](http://shop.oreilly.com/product/9780596007614.do). This doesn't mean I think recipes should look like code. Code is a terrible interface, and frankly humans are a whole lot smarter and better at inferring information than computers are, but there are lessons to be learned from software engineering and over the next few posts I hope to explore them.