class finder
{
    async fetchUsers(user,c,id)
        {
            document.getElementById(id).innerHTML = ""
            const profile = await fetch(`https://api.github.com/users/${user}`)
            const data = await profile.json() ;
            if(data.message)
                {
                    alert("User Not Found")
                }
            else
                {
                    const repositories = await fetch(data.repos_url);
                    const repos = await repositories.json();
                    
                    if (data) 
                        {
                            this.deletedata(c)
                            this.addUserToList(data,repos,c)
                        }
                }
        }

    addUserToList(data,repos,c)
        {
            const list = document.querySelector(c);
            const table = document.createElement('table');
            table.className="table border table-striped mt-5";
            let stars = 0
            for( var i = 0;i<repos.length;i+=1)
                {
                    stars += repos[i].watchers_count
                }
            table.innerHTML = `
                <div id="class">
                <tr>
                    <td><b>Name :</b> ${data.name}</td>
                </tr>

                <tr>
                    <td><b>Bio :</b> ${data.bio} </td>
                </tr>

                <tr>
                    <td><b>Followers :</b> ${data.followers}</td>
                </tr>

                <tr>
                    <td><b>Following :</b> ${data.following}</td>
                </tr>

                <tr>
                    <td><b>Total Repositories :</b> ${data.public_repos}</td>
                </tr>

                <tr>
                    <td><b>Total Stars :</b> ${stars}</td>
                </tr>

                <tr>
                    <td><b>Github Url :</b> <a href="${data.html_url}">${data.html_url}</a></td>
                </tr>
                </div>
            `;

            list.appendChild(table);
        }

    deletedata(c)
        {
            var e = document.querySelector(c); 
            var child = e.lastElementChild;  
            e.removeChild(child)
        }
}

const debounce = (func,delay) => {
    let timer;
    return function(...args){
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout( () => {
        func(...args)
      },delay)
} }

const search = document.getElementById('username');
const search1 = document.getElementById('username1');
let users;

// FIlter states
async function searchUser(searchText,id,search,clear){
    const matchList = document.getElementById(id);
    if(searchText !== "")
    {
        const res =  await fetch(`https://api.github.com/search/users?q=${searchText}`);
        users = await res.json();
        if(users.total_count === 0)
        {
            matchList.innerHTML = ""
        }
        else
        {
            let matches;
            matches = users.items.filter(user => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return user.login.match(regex);
            });

            const html = matches.slice(0,6).map(match => `<div class="autocomplete">
            <p style="padding-top: 15px;"><img class="img" src=${match.avatar_url} alt=${match.avatar_url}/> ${match.login}</p>
            </div>`).join('');
            matchList.innerHTML = html;
            matchList.addEventListener('click', (e) => {
            search.value = e.target.textContent.trim();
            matchList.style.display = "none";
            matchList.innerHTML = ""
            })
            matchList.style.display = "block";
        }
    }
    else
    {
        matchList.innerHTML = ""   
    }
    document.getElementById(clear).addEventListener('click', () => {
        matchList.innerHTML = ""
        }) 
}

search.addEventListener('input', debounce( () => searchUser(search.value,"match-list",search,"clear"),1000));
search1.addEventListener('input', debounce( () => searchUser(search1.value,"match-list1",search1,"clear1"),1000));

const git = new finder();

document.querySelector('#user-form').addEventListener('submit', (e) =>
{
    e.preventDefault();
    const c = '#user-form'
    const username = document.querySelector('#username').value
    git.fetchUsers(username,c,"match-list")
});


document.querySelector('#user-form1').addEventListener('submit', (e) =>
{
    e.preventDefault();
    const c = '#user-form1'
    const username = document.querySelector('#username1').value
    git.fetchUsers(username,c,"match-list1")
});