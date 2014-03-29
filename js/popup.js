/*
 * Chrome Glyphs
 *
 * This file contains Chrome Glyphs popup functions 
 *
 * @package		Chrome Glyphs
 * @category	Popup
 * @author		Trajche Petrov & Aleksandar Jovanov
 * @link		https://github.com/klikstermkd/Chrome-Glyphs
*/

/*
 * ---------------------------------------------------------------------------------------------------------------------
 * Defining main popup variables
 * ---------------------------------------------------------------------------------------------------------------------
*/
    var debug = true,
        menu = document.getElementById("menu"),
        cont = document.getElementById("container"),
        copied = document.getElementById("copied"),
        clipboard = document.getElementById('clipboard'),
        dbGlyphs = JSON.parse(localStorage.getItem("glyphs"));
/*
 * ---------------------------------------------------------------------------------------------------------------------
 * Generate glyphs
 * ---------------------------------------------------------------------------------------------------------------------
*/
    function generate_menu(glyphs)
    {
        var ul = document.createElement("ul");
            
        for(key in glyphs)
        {
            li = document.createElement("li");

            li.data = key;

            li.innerHTML = glyphs[key].name;
                
            li.addEventListener("click", function() // add event listener
            {
                generate(dbGlyphs,this.data);
            });
                
            ul.appendChild(li);
        }

        menu.appendChild(ul);
    }
/*
 * ---------------------------------------------------------------------------------------------------------------------
 * Generate glyphs
 * ---------------------------------------------------------------------------------------------------------------------
*/
    function generate(glyphs,cat)
    {
        cont.innerHTML = '';
        var ul = document.createElement("ul");
            
        for(item in glyphs[cat].glyphs)
        {
            li = document.createElement("li");

            // to do disable/enable from options
            li.setAttribute('data-tooltip',glyphs[cat].glyphs[item]);

            li.innerHTML = glyphs[cat].glyphs[item];
                
            li.addEventListener("click", function() // add event listener
            {
                send_glyph(this.innerHTML);
            });
                
            ul.appendChild(li);          
        }
            cont.appendChild(ul);
    }
/*
 * ---------------------------------------------------------------------------------------------------------------------
 * Insert choosen glyph into selected input element or if not copy to clipboard
 * ---------------------------------------------------------------------------------------------------------------------
*/
    function send_glyph(glyph)
    {
        chrome.tabs.getSelected(null, function(tab)
        {
            chrome.tabs.sendRequest(tab.id, {glyph: glyph},function(response)
            {
                if(response.action == 'copy')
                {
                    copy(response.glyph);
                }
            });
        });
    }

/*
 * ---------------------------------------------------------------------------------------------------------------------
 * Copy function - copyies choosen glyph if no input element is selected
 * ---------------------------------------------------------------------------------------------------------------------
*/
    function copy(glyph)
    {
        clipboard.value = glyph;					
        clipboard.focus();
        clipboard.select();
        document.execCommand('Copy');
        copied.style.height = "25px";
        copied.style.opacity = "1";
        timeout = setTimeout(function()
        {
            copied.style.height = "0px";
            copied.style.opacity = "0";
        },3000)
    }

/*
 * ---------------------------------------------------------------------------------------------------------------------
 * Load main functions & initialize localstorage glyphs
 * ---------------------------------------------------------------------------------------------------------------------
*/
    (function()
    {
        //console.log(dbGlyphs);

        if(dbGlyphs == null || dbGlyphs === undefined || debug)
        {
            localStorage.setItem("glyphs", JSON.stringify(glyphs));
            dbGlyphs = JSON.parse(localStorage.getItem("glyphs"));
        }
        
        generate_menu(dbGlyphs);
        generate(dbGlyphs,'currency'); //generate glyphs emelements
    })();