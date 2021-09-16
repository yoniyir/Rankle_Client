# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import random
def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press Ctrl+F8 to toggle the breakpoint.


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
      print_hi('PyCharm')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/

def random_groups_by_rank(active_players, size_group):
    other = []
    while len(active_players) % size_group != 0:
          other_player = random.choice(active_players)
          other.append(other_player)
          active_players.remove(other_player)



        ##sorted(active_players(by rank)
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


active_players = [1,2,3,4,5,6,7,8,9,10]
print(random_groups_by_rank(active_players, 4))


