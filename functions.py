import random


def randomize_players(active_players, size):
    lst = []
    num_of_active_players = int(len(active_players))
    num_of_groups = int(num_of_active_players / size)
    other = []
    while len(active_players) % size != 0:
        other_player = random.choice(active_players)
        other.append(other_player)
        active_players.remove(other_player)

    for i in range(0, num_of_groups):
        temp = []
        for j in range(0, size):
            random_player = random.choice(active_players)
            temp.append(random_player)
            active_players.remove(random_player)
        lst.append(temp)
    return lst, other






def randomize_by_rank(active_players, size_group):
    other = []
    while len(active_players) % size_group != 0:
          other_player = random.choice(active_players)
          other.append(other_player)
          active_players.remove(other_player)

    active_players.sort(key = get_rank)
    num_of_groups = int(len(active_players) / size_group)
    num_of_groups_by_rank = size_group
    size_group_by_rank = num_of_groups
    new_arr = []
    temp = []
    random_groupss = []
    for i in range(0,len(active_players)):
        temp.append(active_players[i])
        if len(temp) == size_group_by_rank :
            new_arr.append(temp)
            temp = []

    for i in range(0,num_of_groups):
        temp = []
        for j in range(0,size_group):
            player = random.choice(new_arr[j])
            new_arr[j].remove(player)
            temp.append(player)
        random_groupss.append(temp)
    return random_groupss , other



def get_rank(player):
    return int(player.get('rank'))