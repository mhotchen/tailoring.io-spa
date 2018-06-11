# Tailoring Online Platform frontend

## Requirements:

* Node.js > 10
* NPM
* Yarn
* Global installation of Vuejs and Quasar (`npm install -g vue-cli && npm install -g quasar-cli`)

Then to run:

```bash
cp .env.example .env # You'll need to edit this ready for local development
yarn install
quasar dev
```

## Warning

I am not very up-to-date with my front-end development skills, and especially the javascript ecosystem which has moved
on a lot since I've last worked with it. Whilst I have always had a reasonable eye for UX, I have struggled somewhat
with the organization of the code in this repository. I am moving fast to try and build a viable business which means
I've taken shortcuts in my learning which I can already see in the general disorganization and some of the code
duplication I have left littered around.

## Design goals

* Following Google's [RAIL model](https://developers.google.com/web/fundamentals/performance/rail)
* Mobile first responsive design targeting mid-range Android phones and better
* Hidden complexity: put the user first, even if it makes the code more verbose or complex
* Principle of least surprise: things should behave as expected and the application should feel 'unnoticed' and out of
  the way, letting users get on with their task

## Performance

Networks are slow, especially so for many tailors who work out of places where their connection might be unreliable or
generally low quality. This means special attention should be put in to making the application feel fast, even when
things are going slow. Use AJAX loaders to give instant feedback, pre-load data when it's stored locally whilst a
refresh happens in the background and especially, try to get enough information stored locally to let the user work
even if their internet connection has gone away.

## Offline usage

Because of the unreliable nature of mobile networks it should be possible to create at least one customer and their
complete order offline, after the user has got the dashboard loaded. This will be stored locally, giving the user
a warning that it hasn't been saved to our systems yet, then pushed to the backend when a connection can be made.

In the future, ideally, a full day's worth of customers should be able to be handled this way.

## Measurements

Because tailors take measurements in both centimeters and inches some considerations needed to be made for the storage.
It would be unwise to try and store measurements in both centimeters and inches because we would have issues if the
user later decided they wanted to view the measurements in a different format. Rather it would be better to store the
measurements in a single unit of measurement and convert to/from the customer's preferred unit on the fly.

If a customer logs the measurement 30.25 inches then storing as centimeters of even millimeters doesn't provide enough
accuracy. 30.25 inches converted to millimeters and back to inches again yields the result 30.23622 inches since that's
768 mm. 30.25 inches is actually 768.35 mm. For that reason the storage needs to be a more accurate unit of measurement
and the standised micrometers (µm, one thousandth of a millimetre, or one millionth of a metre) is used instead. 30.25
inches can be stored without any loss of accuracy as 768350 µm.

Finally, inches are broken down in to quarters, whereas centimeters are never broken down in to sub-units.
