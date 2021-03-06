from django.shortcuts import render, redirect
from workplace.models import *
from nodes.models import Node
from products.models import Products
from forum.models import Question
from nodes.forms import SetLogoForm
from activities.models import Enquiry
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from itertools import chain
from operator import attrgetter
from workplace.views import no_hits


def workplace_profile(request, slug):
    workplace_logo_form = SetLogoForm()
    workplace = Workplace.objects.get(slug=slug)
    if request.user.is_authenticated():
        usrprofile = request.user.userprofile
        if workplace.id == usrprofile.primary_workplace_id:
            member = True
    content_url = "workplace/snip_about.html"
    content_head_url = "workplace/snip_about_head.html"
    if request.is_ajax():
        return render(request, content_url, locals())
    else:
        t = Thread(target=no_hits, args=(workplace.id,))
        t.start()
        meta = True
        return render(request, 'workplace/profile.html', locals())


def dashboard(request, slug):
    workplace = Workplace.objects.get(slug=slug)
    if request.user.is_authenticated():
        workplace_logo_form = SetLogoForm()
        if request.user.is_authenticated():
            if request.user.userprofile in workplace.userprofile_set.all():
                member = True
        content_url = "workplace/snip_dashboard.html"
        content_head_url = "workplace/snip_dashboard_head.html"
        member_count = workplace.userprofile_set.all().count()
        products = Products.objects.filter(producer=workplace.pk)
        inquiry_count = Enquiry.objects.filter(product__in=products).count()
        new_inq_count = Enquiry.objects.filter(product__in=products, seen=False).count()
        com_mail = request.user.userprofile.product_email

        node_count = Node.objects.filter(user__userprofile__primary_workplace=workplace).count()

        completion_score = (workplace.get_tags_score() + workplace.get_product_score() + workplace.get_info_score() +
                            (workplace.points)/(10*member_count) + workplace.get_member_score())/5
        if request.is_ajax():
            return render(request, content_url, locals())
        else:
            t = Thread(target=no_hits, args=(workplace.id,))
            t.start()
            meta = True
            return render(request, 'workplace/profile.html', locals())
    else:
        return redirect('/workplace/'+workplace.slug)


def activity(request, slug):
    workplace = Workplace.objects.get(slug=slug)
    workplace_logo_form = SetLogoForm()
    if request.user.is_authenticated():
        if request.user.userprofile in workplace.userprofile_set.all():
            member = True
    questions = Question.objects.filter(user__userprofile__primary_workplace=workplace).select_related('user')
    answers = Question.objects.filter(answer__user__userprofile__primary_workplace=workplace).select_related('user')
    feeds = Node.objects.filter(user__userprofile__primary_workplace=workplace, category__in=['F', 'D']).select_related('user')
    articles = Node.objects.filter(user__userprofile__primary_workplace=workplace, category='A').select_related('user')
    all_result_list = sorted(
        chain(feeds, questions, answers, articles),
        key=attrgetter('date'), reverse=True)
    paginator = Paginator(all_result_list, 5)
    page = request.GET.get('page')
    try:
        result_list = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        result_list = paginator.page(1)
    except EmptyPage:
                # If page is out of range (e.g. 9999), deliver last page of results.
        return
        # result_list = paginator.page(paginator.num_pages)
    if page:
        return render(request, 'nodes/five_nodes.html', {'result_list': result_list})
    else:
        content_url = "workplace/snip_activity.html"
        content_head_url = "workplace/snip_activity_head.html"
        if request.is_ajax():
            return render(request, content_url, locals())
        else:
            t = Thread(target=no_hits, args=(workplace.id,))
            t.start()
            meta = True
            return render(request, 'workplace/profile.html', locals())


def products(request, slug):
    workplace = Workplace.objects.get(slug=slug)
    workplace_logo_form = SetLogoForm()
    if request.user.is_authenticated():
        if request.user.userprofile in workplace.userprofile_set.all():
            member = True
    content_url = "workplace/snip_products.html"
    content_head_url = "workplace/snip_products_head.html"
    products = workplace.products_set.all()
    if request.is_ajax():
        return render(request, content_url, locals())
    else:
        t = Thread(target=no_hits, args=(workplace.id,))
        t.start()
        meta = True
        return render(request, 'workplace/profile.html', locals())


def members(request, slug):
    workplace = Workplace.objects.get(slug=slug)
    workplace_logo_form = SetLogoForm()
    if request.user.is_authenticated():
        if request.user.userprofile in workplace.userprofile_set.all():
            member = True
    content_url = "workplace/snip_members.html"
    content_head_url = "workplace/snip_members_head.html"
    if request.is_ajax():
        return render(request, content_url, locals())
    else:
        t = Thread(target=no_hits, args=(workplace.id,))
        t.start()
        meta = True
        return render(request, 'workplace/profile.html', locals())
