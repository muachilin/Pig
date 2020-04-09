<h1 align="center">
  FuzzyOcto
</h1>

<p align="center">
  <a href="">
    <img alt="" src="https://images.emojiterra.com/google/android-nougat/512px/1f419.png" width="200" />
  </a>
</p>

<p align="center">
  <a href=""><img alt="FuzzyOcto status" src="https://github.com/muachilin/FuzzyOcto/workflows/FuzzyOcto-Test/badge.svg"></a>
</p>


A tiny Github Action built with TypeScript for managing labels and comments in issues!

Stay at home and play with Github :octocat:


## Add label when committing

When you commit a branch and open a corresonding pull request, FuzzyOcto will automatically add a label of `in progress` to the linked issue of this pull request!

Remember to include the number of linked issue in the title of the pull request in the parentheses:

```bash
My pull request title (#123)
```

## Comment on linked issue when committing to pull request

When you commit a branch and open a corresonding pull request, FuzzyOcto will automatically comment on the linked issue of this pull request!

```bash
This issue is linked to the pull request #125
```
