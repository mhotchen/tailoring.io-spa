# Customers store

I've had to do a lot of careful work here for performance reasons so I thought I would give an overview of what and why.

Initially I took the approach of storing each customer in a separately loaded version of the 'customer' module
so that data loaded for retrieving a list of customers can be re-used on the view/edit customer page.
The primary benefit of this is that it simplifies the page vues substantially because they can rely on the reactive
getters for automatically updating the page during search results and such. However this came with a significant
performance penalty.

Instead I've now switched to a database that can be completely overwritten. Each customer has a key identified by its
ID in the state, and there's an index array that keeps a list of IDs from the last insertion. The next time the database
is written to all existing customers are deleted and it is populated only with the new results.

Not only does this improve memory and performance usage, but by keeping the most recently used customers in here we
can hydrate the view/edit customer pages with data from this database if the customer is in here. Chances are good that
the most recently stored data in this database can be used on the customer view/edit page. At the same time, in the
background a call to the API will be made to get the most recent data from it. This means the view/edit page can load
instantly in the majority of cases.

The `lastInserted` index which holds the IDs of the keys that were last appended is useful for reactive components
that only want to show eg. the search results which may or may not populate the entire database. Use the
`getLastInsertedCustomers` getter which will return the ID for each customer that was most recently inserted. This ID
can then be passed to the other getters to get specific values from it.
