from django.shortcuts import render, redirect, HttpResponse
from django.template.loader import render_to_string
from products.models import Category, Product_Categories, Products
from nodes.models import Images
from django.contrib.auth.decorators import login_required, user_passes_test
from activities.models import Enquiry
from datetime import datetime, timedelta, time, date
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from nodes.models import Node
from operator import itemgetter
from home.tasks import execute_view


@login_required
def add_product(request):
    user = request.user
    workplace = request.user.userprofile.primary_workplace
    if request.method == 'POST':
        # add product and return something
        return render(request, 'products/add_multi.html', {'first_time': False})
    else:
        # show the add products page
        p = Products.objects.filter(producer=workplace).last()
        if user.userprofile.product_email:
            no_prod_con = False
        else:
            no_prod_con = True
        c = {}
        if p:
            c = Product_Categories.objects.filter(
                product=p.id).order_by('level')
        c1_all = Category.objects.filter(level=1)
        c1_1 = itemgetter(0, 1, 2)(c1_all)
        c1_2 = itemgetter(3, 4, 13)(c1_all)
        c1_3 = itemgetter(2, 5)(c1_all)
        c1_4 = itemgetter(6, 7, 12, 13)(c1_all)
        c1_5 = itemgetter(9, 8, 6)(c1_all)
        c1_6 = itemgetter(10, 11)(c1_all)
        # c1_7 = itemgetter(6, 7, 12)(c1_all)
        c1_8 = itemgetter(13, 14, 15)(c1_all)
        first_time = False
        return render(request, 'products/add_multi.html', locals())
