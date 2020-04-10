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


A tiny Github Action built with JavaScript for managing labels and comments in issues :dart:

Let FuzzyOcto help you build the bridge between issues and pull requests 🔥

Stay home and play with Github :octocat:


## 🏷️ Labeling

When you commit to a branch and open a corresonding pull request, FuzzyOcto will automatically add a label of `in progress` to the linked issue of this pull request.
<br></br>
<p align="center">
 <img alt="" src="examples/add_label.png" width="500" />
</p>
<br></br>

👉 Remember to include the number of linked issue in the title of the pull request in the parentheses

```bash
My pull request title (#123)
```

## 🏷️  Delabeling
After you merge the pull request, FuzzyOcto will automatically remove the original `in progress` label and add the `done` label to the linked issue. Therefore, user can easily see which issues are already solved. 

<br></br>
<p align="center">
 <img alt="" src="examples/remove_label.png" width="500" />
</p>
<br></br>


## 📝 Mentioning

When you commit to a branch and open a corresonding pull request, FuzzyOcto will automatically comment on the linked issue of this pull request. Besides, FuzzyOcto will tag the person who open the pull request on the linked issue. Therefore, user can see who and which PR is handling this issue very easily.

<p align="center">
 <img alt="" src="examples/issue_comment.png" width="700" />
</p>
