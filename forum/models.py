from django.db import models
from django.contrib.auth.models import User
from tags.models import Tags
from nodes.models import Images
from industryo.unique_slug import unique_slugify
from activities.models import Activity
# from userprofile.models import UserProfile


class Question(models.Model):
    user = models.ForeignKey(User)
    anonymous = models.BooleanField(default=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    question = models.TextField(max_length=5000, null=True, blank=True)
    votes = models.IntegerField(default=0)
    answers = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)          # date changed to datetime
    answered = models.BooleanField(default=False)
    tags = models.ManyToManyField(Tags)
    images = models.ManyToManyField(Images)
    admin_score = models.IntegerField(default=1)
    score = models.FloatField(default=0)            # score added and two more below
    is_active = models.BooleanField(default=True)
    last_active = models.TimeField(auto_now=True)

    class Meta:
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        ordering = ('-date',)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:                  # Newly created object, so set slug
            slug_str = self.title
            unique_slugify(self, slug_str)
            # self.slug = slugify(self.get_full_name()).__str__()
            super(Question, self).save(*args, **kwargs)

    def get_all_question(self):
        all_question = Question.objects.all()[:50]
        return all_question

    def get_unanswered(self):
        all_unanswered = Question.objects.filter(answered=False)[:20]
        return all_unanswered

    def get_tagged(self, tag):
        all_tagged = Question.objects.filter()

    def create_tags(self, tag):
        # tags = tags.strip()
        tag_list = tag.split(',')
        for ta in tag_list:
            print(ta)
            t, created = Tags.objects.get_or_create(tag=ta)
            # self.tags(tags=t, question=self)

    def get_q_upvoters(self):
        upvotes = Activity.objects.filter(question=self.pk, activity='U')
        list = []
        for upvote in upvotes:
            list.append(upvote.user)
        return list

    def get_q_downvoters(self):
        downvotes = Activity.objects.filter(question=self.pk, activity='D')
        list = []
        for downvote in downvotes:
            list.append(downvote.user)
        return list

    def get_q_votes(self):
        upvotes = Activity.objects.filter(question=self.pk, activity='U').count()
        downvotes = Activity.objects.filter(question=self.pk, activity='D').count()
        votes = upvotes-downvotes
        self.votes = votes
        self.save()
        # print(votes)
        return votes

    def get_a_votes(self):
        upvotes = Activity.objects.filter(answer=self.pk, activity='U').count()
        downvotes = Activity.objects.filter(answer=self.pk, activity='D').count()
        votes = upvotes-downvotes
        self.votes = votes
        self.save()
        print("dfghjkldfghjk")
        return votes

    def get_summary(self, value):
        summary_size = 50
        if len(value) > summary_size:
            return u'{0}...'.format(value[:summary_size])
        else:
            return value

    def get_answer_preview(self):
        answer = Answer.objects.filter(question=self.pk)[:1]
        if answer:
            for a in answer:
                ans = a.answer
                return ans

        else:
            return "no answers till now"
        # ans = answer.answer
        # # preview = self.get_summary(ans.answer)
        # return ans


class Answer(models.Model):
    user = models.ForeignKey(User)
    anonymous = models.BooleanField(default=False)
    question = models.ForeignKey(Question)
    votes = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    answer = models.TextField(max_length=10000)
    date = models.TimeField(auto_now_add=True)
    score = models.FloatField(default=0)
    admin_score = models.IntegerField(default=1)
    last_active = models.TimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    images = models.ManyToManyField(Images)

    class Meta:
        verbose_name = 'Answer'
        verbose_name_plural = 'Answers'
        ordering = ('-votes', 'date',)

    def __str__(self):
        return self.answer

    def all_answer(self, qid):
        all_ans = Answer.objects.filter(question=qid)
        return all_ans






# Create your models here.
