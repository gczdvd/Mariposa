<?php
    $webPath = "/documentation";
    $backPath = "src";

    function getDir($elem, $d = ""){
        global $webPath, $backPath;
        $dirs = scandir($backPath . $d);

        $ul = $elem->appendChild(new DOMElement("ul"));
        for($i = 2; $i < sizeof($dirs); $i++){
            if(is_dir($backPath . $d . '/' . $dirs[$i])){
                $li = $ul->appendChild(new DOMElement("li"));
                $a = $li->appendChild(new DOMElement("a"));
                $a->setAttribute("href", $webPath . $d . "/" . $dirs[$i]);
                $a->textContent = $dirs[$i];
                getDir($ul, $d . '/' . $dirs[$i]);
            }
        }
    }

    $doc = new DOMDocument();
    $doc->loadHTML(mb_convert_encoding(file_get_contents("raw.html"), 'HTML-ENTITIES', "UTF-8"));

    $menu = $doc->getElementById("menu");
    getDir($menu);

    $route = explode("/", $_SERVER["REQUEST_URI"]);
    array_splice($route, 0, 2);
    $path = implode("/", $route);

    $e = new DOMElement("a");
    $e->textContent = $path;
    $doc->getElementById("header")->appendChild($e);
    
    if(is_file($backPath . '/' . $path . "/index.html")){
        $con = new DOMDocument();
        $con->loadHTML(mb_convert_encoding(file_get_contents($backPath . '/' . $path . "/index.html"), 'HTML-ENTITIES', "UTF-8"));
        $doc->getElementById("content")->appendChild($doc->importNode($con->getElementById("content"), true));

        $jump = $con->getElementsByTagName("s");
        for($i = 0; $i < count($jump); $i++){
            $ju = new DOMElement("a");
            $ju->textContent = $jump[$i]->textContent;
            $nju = $doc->getElementById("jump")->appendChild($ju);
            $nju->setAttribute("href", "#" . $jump[$i]->getAttribute("id"));
        }
    }
    


    echo $doc->saveHTML();
?>