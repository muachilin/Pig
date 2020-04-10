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


## 🏷️ Labeling

When you commit a branch and open a corresonding pull request, FuzzyOcto will automatically add a label of `in progress` to the linked issue of this pull request!
<br></br>
<p align="center">
 <img alt="" src="examples/add_label.png" width="500" />
</p>
<br></br>

👉 Remember to include the number of linked issue in the title of the pull request in the parentheses:

```bash
My pull request title (#123)
```

## 📝 Mentioning

When you commit a branch and open a corresonding pull request, FuzzyOcto will automatically comment on the linked issue of this pull request. Besides, FuzzyOcto will tag the person who open the pull request related to this issue. Therefore, user can see who and which PR is handling this issue very easily!

<p align="center">
 <img alt="" src="examples/issue_comment.png" width="700" />
</p>
