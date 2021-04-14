# Chapter04

## Use `Initiative Phase` with multiple controls

In this chapter, you learn about `Initiative Phase` and basis of child controls.

Sometimes your skill would ask some questions to user for completing user requirement.  And these are expected to proper for user's response.

But if your skill needs to gather some information from user like travel reservation skill, it's difficult to handle user's response and make proper question by only using `handle` function. Your skill need to recite property for user's response and make proper question. Basically these logics are complicate.

To solve it, we can introduce `Initiative Phase`.Technically, this is very similar to `Handle Phase`. ask-sdk-controls framework executes `canHandle` and add response fragments to response builder by executing `handle`. After, executes `canTakeInitiative` and add response fragments to response builder by executing `takeInitiative`. Finally all fragments are combined.
