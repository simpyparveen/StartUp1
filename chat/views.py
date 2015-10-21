from django.shortcuts import render, redirect, HttpResponseRedirect, HttpResponse
from chat.models import Message
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
import json


@login_required
def inbox(request):
    conversations = Message.get_conversations(user=request.user)
    active_conversation = None
    messages = None
    if conversations:
        conversation = conversations[0]
        active_conversation = conversation['user'].username
        messages = Message.objects.filter(user=request.user, conversation=conversation['user'])
        messages.update(is_read=True)
        for conversation in conversations:
            if conversation['user'].username == active_conversation:
                conversation['unread'] = 0
    return render(request, 'messages/inbox.html', {
        'messages': messages,
        'conversations': conversations,
        'active': active_conversation
        })


@login_required
def messages(request, username):
    conversations = Message.get_conversations(user=request.user)
    active_conversation = username
    messages = Message.objects.filter(user=request.user, conversation__username=username)
    messages.update(is_read=True)
    for conversation in conversations:
        if conversation['user'].username == username:
            conversation['unread'] = 0
    return render(request, 'messages/inbox.html', {
        'messages': messages,
        'conversations': conversations,
        'active': active_conversation
        })

@login_required
def delete(request):
    return HttpResponse()

@login_required
def new(request):
    if request.method == 'POST':
        from_user = request.user
        to_user_username = request.POST.get('person')
        try:
            to_user = User.objects.get(username=to_user_username)
        except Exception:
            try:
                to_user_username = to_user_username[to_user_username.rfind('(')+1:len(to_user_username)-1]
                to_user = User.objects.get(username=to_user_username)
            except Exception:
                print('dasdamd')
                return redirect('/messages/new/')
        message = request.POST.get('message')
        print(message)
        if len(message.strip()) == 0:
            return redirect('/messages/new/')
        if from_user != to_user:
            Message.send_message(from_user, to_user, message)
        print(from_user, to_user)
        return redirect(u'/messages/{0}/'.format(to_user_username))

    else:
        conversations = Message.get_conversations(user=request.user)
        return render(request, 'messages/new_modal.html', {'conversations': conversations})


@login_required
def send(request):
    if request.method == 'POST':
        from_user = request.user
        to_user_username = request.POST.get('to')
        to_user = User.objects.get(username=to_user_username)
        message = request.POST.get('message')
        if len(message.strip()) == 0:
            return HttpResponse()
        if from_user != to_user:
            msg = Message.send_message(from_user, to_user, message)
            return render(request, 'snippets/partial_message.html', {'message': msg})
        return HttpResponse()
    else:
        return redirect('/')

@login_required
def users(request):
    print('jklop')
    users = User.objects.filter(is_active=True)
    print('jkldsvdwp')
    dump = []
    template = u'{0} ({1})'
    for user in users:
        dump.append(user.username)
    data = json.dumps(dump)
    print('wskkkkkkdwp')
    return HttpResponse(data, content_type='application/json')

@login_required
def check(request):
    count = Message.objects.filter(user=request.user, is_read=False).count()
    return HttpResponse(count)
# Create your views here.