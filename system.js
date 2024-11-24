//ゲームシステムの中身です。各所に日本語のコメントアウトが目立ちますね。
//初めて作ったので恐ろしいほどに注釈が入ってます。
//変な理解をしているところが散見されるかと思いますが、無視してくださいね!
//自分用に書こうと思いましたがそれだけでは面白くないので、こんなディープなところまで見てくださるあなたに伝わるように書くことにしました!
//横茶横葉はこういう隠しコンテンツとか、意外と大好きな人です! CDとかによくある隠しトラックとか、なんだかワクワクします!
//....この先読んでも ためにはならないので、お暇があれば読んでみてください。
//ネタバレが含まれます(というよりこれはプログラム本体なのでネタ全部詰まってます)。結末や仕掛けをまだ知りたくない方は読まないほうがよさそうです。

//-------Initialization Task!-----------------------
const canvas=document.getElementById("form");
//参照可能化する(浅すぎる知識)
const benrikit=canvas.getContext("2d");
//2Dってすると便利な機能が使える、らしい。
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//ユーザーの画面サイズ変更と回転検知向け

//ブラウザーの記憶域から履歴データを取得
let anzureki=localStorage.getItem("anzureki")?parseInt(localStorage.getItem("anzureki")):0;
let bestanzukosuu=localStorage.getItem("bestanzukosuu")?parseInt(localStorage.getItem("bestanzukosuu")):0;
let yarikomi1=localStorage.getItem("yarikomi1")?parseInt(localStorage.getItem("yarikomi1")):0;//hina content
let yarikomi2=localStorage.getItem("yarikomi2")?parseInt(localStorage.getItem("yarikomi2")):0;//ov40
let yarikomi3=localStorage.getItem("yarikomi3")?parseInt(localStorage.getItem("yarikomi3")):0;//ov50
let yarikomi4=localStorage.getItem("yarikomi4")?parseInt(localStorage.getItem("yarikomi4")):0;//ls5
let yarikomi5=localStorage.getItem("yarikomi5")?parseInt(localStorage.getItem("yarikomi5")):0;//25tms
let yarikomi6=localStorage.getItem("yarikomi6")?parseInt(localStorage.getItem("yarikomi6")):0;//ov30
let yarikomi7=localStorage.getItem("yarikomi7")?parseInt(localStorage.getItem("yarikomi7")):0;//10tms
let yarikomikanryo=localStorage.getItem("yarikomikanryo")?parseInt(localStorage.getItem("yarikomikanryo")):0;//AC
if(anzureki>10)
{
    document.getElementById("jorensan").style.display="block";
}

//オブジェクトを準備
let anzu=[];//杏です!(杏は画像ではなく、オレンジ色の球で表してます。)
let smartphone=[];//横葉はスマホ大好きネ! Smartphones could save the world!
let goldholder=[];
let kuroan=[];
let kosu=0;//食べた個数をストアします。ここに。
let rev=false; //ん-?これも、何だと思います?
let seigenzikan=30;//ここでは制限時間を管理しているよ。
let ginterval;
let generateinterval;
let changeimginterval;
let timer;//あとで数を入れます。

//自作効果音登録!
const paku=new Audio();
paku.src="eatsound.mp3";

const bgm=new Audio();
bgm.src="bgm.mp3";
bgm.preload="auto";

const kon=new Audio();
kon.src="orin.mp3";
//大事なオブジェクト! (全部手書き。)
const futsu=new Image();//インスタンス的にimage属性を付与(勝手な理解)
futsu.src="1.png";//imageの内容を描いた画像にセット。(普通の表情をした杏子さん)

const kuchiake=new Image();//インスタンス的にimage属性を付与(勝手な理解)
kuchiake.src="2.png";//imageの内容を描いた画像にセット。(近づいてくる杏をみて食べたくて仕方ない という表情をした杏子さん)

const oisii=new Image();//コピペ
oisii.src="3.png";//imageの内容を描いた画像にセット。(食べた杏が美味しくて、うれしい表情をした杏子さん)

const waa=new Image();//インスタンス的にimage属性を付与(勝手な理解)
waa.src="4.png";//imageの内容を描いた画像にセット。(スマホが飛んでくることを不可解に思っている表情をした杏子さん なんで飛んでくるんでしょうね?)

const oops=new Image();//インスタンス的にimage属性を付与(勝手な理解)
oops.src="5.png";//何か見つけたみたいです

const hinaoisii=new Image();
hinaoisii.src="6.png";
const hinafutsu=new Image();
hinafutsu.src="7.png";
const hinakonwaku=new Image();
hinakonwaku.src="8.png";

//出現場所指定
const anzuchansizeyoko=200;//左側から覗いている杏子さんの画像の横サイズ
const anzuchansizetate=200;//左側から覗いている杏子さんの画像の縦サイズ 大きくしすぎると簡単になります。小さすぎるとよく見えなくなっちゃいます。

let anzuX=0;//杏子さんはx=0の場所に現れます。
let anzuY=canvas.height/2 - anzuchansizetate/2;//杏子さんは 画面の高さの半分-杏子さん画像の幅の半分 で求められる位置に現れます。
//つまるところ、左端で、かつ画像がめり込まないギリギリの位置に出てくることになりますね!


let anzustate;

    

//ここからが、メインです。
//{}はC#好きなのでそれっぽい配置にしてます。
class anzuhontai //オブジェクト指向わっしょい! (オブジェクト指向 再利用可能なのを作るclass)
{
constructor() //classからオブジェクトが作られるときのinitタスクトリガー。初期状態の定義にぴったり
{
this.radius=25; //あんず球の半径をセット いまは25だよ。難易度調整アプデにはここ変えるかも!
if(rev)
{
    this.x=0+this.radius;
}
else
{
this.x=canvas.width+this.radius;//あんず球のスタート位置を指定。 画面の横の長さ+あんず球の半径 の値から出現。 つまり、右端に半分めり込んだ状態からスタートするよ。
}
this.y=Math.random()*canvas.height;//あんず球のスタート位置高度を乱数指定。 だから、めちゃくちゃな位置から飛んでくるのです! 乱数のレンジは0以上1未満。だから、画面の高さと掛けるとよいのです!
this.speed=17+Math.random()*5;//あんず球のスピードコントローラーです。先ほど申した通り、乱数は0以上1未満! だから、17+[0~1(excl.1)]x5で出てくるのは17~22(excl.22)!(なはずです。)
}
update() //更新動作を行うトリガー。ボールを左へスピードを加味して流します。
{
    if(rev)
    {
        this.x +=this.speed;
    }
    else
    {
    this.x -=this.speed; //スピード分だけ移動 最初の位置-速度(更新されるまでに動く長さ[?])
}
}
draw()//あんず球の生成作業をしてくれるトリガー。
{
    benrikit.beginPath();//新しい球を作ります。
    benrikit.arc(this.x,this.y,this.radius,0,Math.PI*2);//左から順に球のdetailを指定し、球を注文。 
    //constructor()にあるthis.xと.y(あんず球の初期位置)に置いてほしいし、半径は前に指定した通りにしてほしい。角度(ラジアン)は気にしてないので0でいいし(Math.PIx2)(360度、つまり扇形ではなく、完璧な円)にしたい。
    benrikit.fillStyle=`orange`;//あんず球の色をあんずのオレンジに指定(厳密にはオレンジじゃないかも。)
    benrikit.fill();//オレンジで塗りつぶします!
    benrikit.closePath();//作るのおしまい!
}
}

//減点オブジェクトを制御するクラス(飛んでくるスマホ)
class smp
{
    constructor()
    {
        this.width=50;//スマホ画像の幅
        this.height=100;//スマホ画像の高さ
        if(rev)
        {
            this.x=0+this.width/2;
        }
        else
        {
        this.x=canvas.width+this.width/2;//スマホ画像のスタート位置を指定。 画面の横の長さ+スマホ画像の半径 の値から出現。 つまり、右端に半分めり込んだ状態からスタートするよ。しくみはあんず球と同じ!
        }
        this.y=Math.random()*canvas.height;//スマホ画像のスタート位置高度を乱数指定。 だから、めちゃくちゃな位置から飛んでくるのです! 乱数のレンジは0以上1未満。だから、画面の高さと掛けるとよいのです!
        this.speed=18+Math.random()*5;//スマホ画像のスピードコントローラーです。不規則さによる難しさを出すため若干あんず球より早いです。 再掲:先ほど申した通り、乱数は0以上1未満! だから、17+[0~1(excl.1)]x5で出てくるのは17~22(excl.22)!(なはずです)
        this.image=new Image();//スマホが飛んでくる仕様は完全に後付けのものだったので、ここで定義します。
        this.image.src="sm.png";//スマホの手書き画像のありかを示してます。

    }
    update() //更新動作を行うトリガー。スマホを左へスピードを加味して流します。
{
    if(rev)
        {
            this.x +=this.speed;
    }
    else
    {

    
    this.x -=this.speed; //スピード分だけ移動 最初の位置-速度(更新されるまでに動く長さ[?])
}
}
draw()//スマホ画像をオブジェクトにしてくれるトリガー。
{
benrikit.drawImage(this.image,this.x,this.y,this.width,this.height);
//constructor()で割り当てた画像を同じく割り当てた座標、サイズで作って欲しいな の意。
}
}


class kuroanzumk //オブジェクト指向わっしょい! (オブジェクト指向 再利用可能なのを作るclass)
{
constructor() //classからオブジェクトが作られるときのinitタスクトリガー。初期状態の定義にぴったり
{
this.radius=20; //あんず球の半径をセット いまは25だよ。難易度調整アプデにはここ変えるかも!
if(rev)
{
    this.x=0+this.radius;
}
else
{
this.x=canvas.width+this.radius;//あんず球のスタート位置を指定。 画面の横の長さ+あんず球の半径 の値から出現。 つまり、右端に半分めり込んだ状態からスタートするよ。
}
this.y=Math.random()*canvas.height;//あんず球のスタート位置高度を乱数指定。 だから、めちゃくちゃな位置から飛んでくるのです! 乱数のレンジは0以上1未満。だから、画面の高さと掛けるとよいのです!
this.speed=17+Math.random()*5;//あんず球のスピードコントローラーです。先ほど申した通り、乱数は0以上1未満! だから、17+[0~1(excl.1)]x5で出てくるのは17~22(excl.22)!(なはずです。)
}
update() //更新動作を行うトリガー。ボールを左へスピードを加味して流します。
{
    if(rev)
    {
        this.x +=this.speed;
    }
    else
    {
    this.x -=this.speed; //スピード分だけ移動 最初の位置-速度(更新されるまでに動く長さ[?])
}
}
draw()//あんず球の生成作業をしてくれるトリガー。
{
    benrikit.beginPath();//新しい球を作ります。
    benrikit.arc(this.x,this.y,this.radius,0,Math.PI*2);//左から順に球のdetailを指定し、球を注文。 
    //constructor()にあるthis.xと.y(あんず球の初期位置)に置いてほしいし、半径は前に指定した通りにしてほしい。角度(ラジアン)は気にしてないので0でいいし(Math.PIx2)(360度、つまり扇形ではなく、完璧な円)にしたい。
    benrikit.fillStyle=`black`;//あんず球の色をあんずのオレンジに指定(厳密にはオレンジじゃないかも。)
    benrikit.fill();//オレンジで塗りつぶします!
    benrikit.closePath();//作るのおしまい!
}
}


class gold //!?
{
    constructor()
    {
        this.width=100;
        this.height=100;
        if(rev)
        {
            this.x=0+this.width/2;
        }
        else
        {
        this.x=canvas.width+this.width/2;//スマホ画像のスタート位置を指定。 画面の横の長さ+スマホ画像の半径 の値から出現。 つまり、右端に半分めり込んだ状態からスタートするよ。しくみはあんず球と同じ!
        }
        this.y=Math.random()*canvas.height;//スマホ画像のスタート位置高度を乱数指定。 だから、めちゃくちゃな位置から飛んでくるのです! 乱数のレンジは0以上1未満。だから、画面の高さと掛けるとよいのです!
        this.speed=19+Math.random()*5;//スマホ画像のスピードコントローラーです。不規則さによる難しさを出すため若干あんず球より早いです。 再掲:先ほど申した通り、乱数は0以上1未満! だから、17+[0~1(excl.1)]x5で出てくるのは17~22(excl.22)!(なはずです。)
        this.image=new Image();//スマホが飛んでくる仕様は完全に後付けのものだったので、ここで定義します。
        this.image.src="gsm.png";//スマホの手書き画像のありかを示してます。

    }
    update() //更新動作を行うトリガー。スマホを左へスピードを加味して流します。
{
    if(rev)
        {
            this.x +=this.speed;
    }
    else
    {

    
    this.x -=this.speed; //スピード分だけ移動 最初の位置-速度(更新されるまでに動く長さ[?])
}
}
draw()//スマホ画像をオブジェクトにしてくれるトリガー。
{
benrikit.drawImage(this.image,this.x,this.y,this.width,this.height);
//constructor()で割り当てた画像を同じく割り当てた座標、サイズで作って欲しいな の意。
}
}

//あんず球生成
function gen_anzu()
{
    anzu.push(new anzuhontai());//あんずストッカー(let anzu=[];)のリストにpush(追加[add? C#でいうappend?])
}

//スマホ生成
function gen_smp()
{
    smartphone.push(new smp());//スマホストッカー(let smartphone=[];)のリストにpush(追加[add? C#でいうappend?])
}

function gen_kuroan()
{
    kuroan.push(new kuroanzumk());
}

function gen_gold()
{
goldholder.push(new gold());
}

//更新処理 canvas init
function update()
{
    benrikit.clearRect(0,0,canvas.width,canvas.height);//新しいフレームを表示するため、前の描画データを消します。
    benrikit.drawImage(anzustate,anzuX,anzuY,anzuchansizeyoko,anzuchansizetate);//anzustateには杏子ちゃんの今の表情が代入されます。初期は ふつう でしたね!
    anzu.forEach((item,index)=>//この矢印はアロー関数。 function(item,index){}となるところでfunctionという語を略せるよ。
    //forEach文によるループ処理 itemには生成されたボール群から1つずつピックアップされたものがプロパティとともに代入されるよ(ballって読み替えると分かりやすいかも。でも横葉はスマホアプリ開発でこっちのほうが慣れてるのでこうさせていただきます。)。indexはそのボールが何個目なのかを表す数字が記録されるよ。
    {
    item.update();//あんず球の動を反映
    item.draw();//移動反映後の結果をユーザーに見せる。
    if(item.x+item.radius<0)//if文(条件分岐) もし、ボールのx座標位置+半径が0より小さいなら(画面外左端に出たら)
        {
            anzu.splice(index,1);//そのボールを番号(indexに記載されている)から探してそれを一つ(,1の部分)消す。
            //何故splice?(完全な自分用メモです。ごめんなさい!!)
            //spliceはつなぐという意味を持った英単語。でもここでは削除のために使っています。つなぐ 要素はどこにあるのかを下に書いておきます。
            //削除を行う  OO.splice(1,1); OOという=[];(配列)の中から2番目のもの(1番目にするなら0を指定)にスポットライトを当ててそこから数えて1つ分消すコード。
            //削除+つなぐ(挿入) OO.splice(1,1,"Anzu"); OOという=[];(配列)の中から2番目のもの(1番目にするなら0を指定)にスポットライトを当ててそこから数えて1つ分消し、その跡地に(スポットライトが当たっているところに)Anzuを代入するコード。
            //挿入だけ OO.splice(2,0,Anzu);OOという=[];(配列)の中から3番目のものにスポットライトを当ててちょうどAnzuが3番目になるようにAnzuを挿入するコード。削除部には0が入っているので、削除処理はしません。
            //私は最初の例をここで使ったので、疑問に思ってしまいましたが、本当はつなぎ合わせができるメソッド なんですね!
            //勉強になります～!
        }
    
    });
updatesmp();//後述のスマホの更新処理をさせます。
updategld();
updatekuroan();

//得点板を機能させましょう!
document.getElementById("remaining").innerText=`残りあと ${seigenzikan}秒`;
if(rev)
    {
        document.getElementById("anzunokosuu").innerText=`もらったスマホ: ${kosuu}台`;//???
    }
    else
    {

    
//HTMLのエレメントをあらかじめ指定したidで選択し、中身を書き換えます。
document.getElementById("anzunokosuu").innerText=`食べたあんず: ${kosuu}コ`;
}
}

function updatesmp()
{
    smartphone.forEach((item,index)=>//この矢印はアロー関数。 function(item,index){}となるところでfunctionという語を略せるよ。
    //forEach文によるループ処理 itemには生成されたスマホ群から1つずつピックアップされたものがプロパティとともに代入されるよ。indexはそのスマホが何個目なのかを表す数字が記録されるよ。
    {
    item.update();
    item.draw();
    if(item.x+item.width/2<0)//if文(条件分岐) もし、スマホのx座標位置+半径が0より小さいなら(画面外左端に出たら)
        {
            smartphone.splice(index,1);
        }
});
}

function updatekuroan()
{
    kuroan.forEach((item,index)=>//この矢印はアロー関数。 function(item,index){}となるところでfunctionという語を略せるよ。
    //forEach文によるループ処理 itemには生成されたスマホ群から1つずつピックアップされたものがプロパティとともに代入されるよ。indexはそのスマホが何個目なのかを表す数字が記録されるよ。
    {
    item.update();
    item.draw();
    if(item.x+item.width/2<0)//if文(条件分岐) もし、スマホのx座標位置+半径が0より小さいなら(画面外左端に出たら)
        {
            kuroan.splice(index,1);
        }
});
}

function updategld()
{
    goldholder.forEach((item,index)=>//この矢印はアロー関数。 function(item,index){}となるところでfunctionという語を略せるよ。
    //forEach文によるループ処理 itemには生成されたスマホ群から1つずつピックアップされたものがプロパティとともに代入されるよ。indexはそのスマホが何個目なのかを表す数字が記録されるよ。
    {
    item.update();
    item.draw();
    if(item.x+item.width/2<0)//if文(条件分岐) もし、スマホのx座標位置+半径が0より小さいなら(画面外左端に出たら)
        {
            goldholder.splice(index,1);
        }
});
}

function syoutotsuchk() //衝突検知プログラム
{
    anzu.forEach((item,index)=>
        {
            const dstX=item.x-(anzuX+anzuchansizeyoko/2); //あんず球の中心のX座標-(杏子ちゃんの左端X座標-杏子ちゃん画像を2で割った長さ)=あんず球の中心のX座標-杏子ちゃんの 中心の X座標
            const dstY=item.y-(anzuY+anzuchansizetate/2); //略。
            const dst=Math.hypot(dstX,dstY);//ピタゴラスの定理にて杏子ちゃんとあんず球の距離を計測。
        
            //あんず球が近くなったら 表情差分を変更させます。
            if (dst<item.radius+anzuchansizeyoko && dst >=item.radius+anzuchansizeyoko/2)
                //距離<あんず球の半径と杏子ちゃん画像の幅の合計 (杏子ちゃんの中心x座標に画像左端を合わせたときの画像右端の距離(1.5x+球半径 画像を2分割した1つ分を3回足しているのと同じ[文系的遠回り解釈])+ボール半径 この距離感の中に入っているかどうか)、かつ 距離>=あんず球の半径と[杏子ちゃん画像半分の幅]の合計(中心から杏子ちゃん画像右端までの長さが[]。それにボールの半径を加えているのでとても近いが画像の寸前に球があって、重なっていない状態です。(1.0x[右端]+球半径))
            //つまり... 左端から見て画像1.5倍+半径～画像接触寸前(1.0倍+球半径)の範囲内にあんず球があるかどうかを見ます。
            //距離計算はそれぞれあんず球の中心点と、杏子ちゃん画像の中心点を使用しています。
            {
                if(rev)
                    {
                        anzustate=hinafutsu;
                    }
                    else
                    {
             anzustate=kuchiake; 
                     } //あんぐりと口を開けさせます
             clearTimeout(changeimginterval); //タイマー初期化
             changeimginterval=setTimeout(() => 
            {
                if(rev)
                    {
                      anzustate=hinafutsu;
                    }
                    else
                    {
               anzustate=futsu;
                      }  //タイマーセット 500ms後に戻します。
            }, 500);
            }

            //あんず球衝突!
            if(dst<item.radius+anzuchansizeyoko/2)//距離<画像内部に入り込む寸前
            {
              anzu.splice(index,1);//現在選択中のあんず球削除
              if(rev)
                {
                    kon.pause;
                    kon.currentTime=0;
                    kon.play();
                    kosuu--;
                    anzustate=hinakonwaku;

                }
                else
                {
              kosuu++; //食べた判定 ここで1点加点。おめでとう!
              anzustate=oisii;//美味しそうに食べる画像に切替

              paku.play();
                }
              clearTimeout(changeimginterval); //タイマー初期化 タイマーは共用します。
              changeimginterval=setTimeout(() => 
             {
                if(rev)
                    {
                anzustate=hinafutsu;
                    }
                    else
                    {
                anzustate=futsu;  //タイマーセット 200ms後に戻します。
                    }
             }, 200);
            }

        });

        smartphone.forEach((item,index)=>
        {//流用。
            const dstX=item.x-(anzuX+anzuchansizeyoko/2); //ターゲットまでの距離x
            const dstY=item.y-(anzuY+anzuchansizetate/2); //y.
            const dst=Math.hypot(dstX,dstY);//実距離
            if(dst<item.width/2+anzuchansizeyoko/2)
            {
                if(rev)
                    {
                        
                        paku.play();
                        smartphone.splice(index,1);
                        kosuu++;
                        anzustate=hinaoisii;
                    }
                    else
                    {

                   
             
                kon.currentTime=0;
                kon.play();
                smartphone.splice(index,1);
                kosuu--;//一点減点。ざんねん。
                anzustate=waa;//うあぁ な表情に切替
            }
                clearTimeout(changeimginterval); //タイマー初期化 タイマーは共用します。
                changeimginterval=setTimeout(() => 
               {
                if (rev)
                    {
anzustate=hinafutsu;
                    }
                    else
                    {
                  anzustate=futsu;
                      }  //タイマーセット 800ms後に戻します。びっくりしたときって、顔が戻るまで長いですよね!
               }, 800);
            }
        }
        );

        kuroan.forEach((item,index)=>
            {
                const dstX=item.x-(anzuX+anzuchansizeyoko/2); //あんず球の中心のX座標-(杏子ちゃんの左端X座標-杏子ちゃん画像を2で割った長さ)=あんず球の中心のX座標-杏子ちゃんの 中心の X座標
                const dstY=item.y-(anzuY+anzuchansizetate/2); //略。
                const dst=Math.hypot(dstX,dstY);//ピタゴラスの定理にて杏子ちゃんとあんず球の距離を計測。
    
                //??あんず球衝突!
                if(dst<item.radius+anzuchansizeyoko/2)//距離<画像内部に入り込む寸前
                {
                  anzu.splice(index,1);//現在選択中のあんず球削除
                  if(rev)
                    {
                       
                        kon.currentTime=0;
                        kon.play();
                        kosuu--;
                        anzustate=hinakonwaku;
    
                    }
                    else
                    {
                  kosuu--;
                  kosuu--; 
                  anzustate=waa;
    
                  paku.play();
                    }
                    gen_smp();
                 clearTimeout(changeimginterval); //タイマー初期化 タイマーは共用します。
                  changeimginterval=setTimeout(() => 
                 {
                    if (rev)
                    {
anzustate=hinafutsu;
                    }
                    else
                    {
                    anzustate=futsu;
                    }  //タイマーセット 200ms後に戻します。
                 }, 200);
                }
    
            });



        goldholder.forEach((item,index)=>
            {//流用。
                const dstX=item.x-(anzuX+anzuchansizeyoko/2); //ターゲットまでの距離x
                const dstY=item.y-(anzuY+anzuchansizetate/2); //y.
                const dst=Math.hypot(dstX,dstY);//実距離
                if(dst<item.width/2+anzuchansizeyoko/2)
                {
                    if(rev)
                        {
                            
                            paku.play();
                            goldholder.splice(index,1);
                            kosuu++;
                            kosuu++;
                            kosuu++;
                            kosuu++;
                            anzustate=hinaoisii;
                        }
                        else
                        {
    
                       

                    kon.currentTime=0;
                    kon.play();
                    goldholder.splice(index,1);
                    kosuu--;//一点減点。ざんねん。 手机不是食物。
                    anzustate=oops;//意味深 な表情に切替

                }
                gen_anzu();
                gen_anzu();
                gen_anzu();
                gen_anzu();
                gen_anzu();
                gen_anzu();
                gen_anzu();
                gen_anzu();
                    clearTimeout(changeimginterval); //タイマー初期化 タイマーは共用します。
                    changeimginterval=setTimeout(() => 
                   {
                    if (rev)
                        {
    anzustate=hinafutsu;
                        }
                        else
                        {
                      anzustate=futsu;
                          }  //タイマーセット 1s後に戻します。びっくりしたときって、顔が戻るまで長いですよね!
                   }, 1000);
                }
            }
            );
}

//ゲームの用意から始めるまでの処理を入れるよ
        function beginplay()
        {
            if(rev)
            {
anzustate=hinafutsu;
            }
            else
            {
            anzustate=futsu;
            }
            document.getElementById("hinamode").style.display="none";
            if(rev)
            {
                document.getElementById("b2tm").style.display="block";  
            }

            if(rev)
            {
anzuX=canvas.width-anzuchansizeyoko;
            }
            else
            {
anzuX=0;//なんの処理をしているんでしょうね! 
            }
          kosuu=0;//reset!
          anzu=[];//reset!
          smartphone=[];//reset!
          goldholder=[];
          kuroan=[];
          seigenzikan=30;//reset!
          document.getElementById("res").style.display="none";//結果表示divを非表示!
          ginterval=setInterval(()=>
        {
            update();
            syoutotsuchk();
        },1000 / 60);//1000ms=1sec. そのうちに60回init. なので60fps!
          generateinterval=setInterval(() => 
        {
          gen_anzu();//丹精込めてあんず球を作ります。
          if(Math.random()<0.5) //乱数を使って50%の確率でスマホを製造し、投げます。
            {
             gen_smp();//スマホは、レベルを下げるために多少少なめに作ります。
            }   

            if(yarikomikanryo!=0)//没設定 全部クリアした場合にのみ一般開放
            //なんで没? A.レベル調整が難しくなったからです!このモードを開放すると、最大獲得可能得点が3桁になります
            //なんで最後に開放? A.逆にその方がワクワクしませんか!? 面白そうだったのでそのように変更しておきました!
            //gen_gold 金色のスマホが放出されます。当たると普通に減点されますが、その後あんずがいっぱい飛んできます。
            //gen_kuroan 黒あんずです。腐っています。食べてしまうと、大量のスマホが飛んできます。(ここの設定が私には時間がなくてできなかったので、断念しました)
            
                        {
            if(anzureki.toString().includes("3"))
            {
                if(Math.random()<0.2) //乱数を使って20%の確率で????を製造し、投げます。
                {
                 gen_gold();
                 
                } 
                if(Math.random()<0.1)
                {
                    gen_kuroan();
                    gen_gold();
                }
            }
            if(anzureki.toString().includes("5"))
                {
                    if(Math.random()<0.1) //乱数を使って10%の確率で????を製造し、投げます。
                    {
                     gen_gold();
                    } 
                    if(Math.random()<0.1)
                        {
                            gen_kuroan();
                            gen_gold();
                        }
                }
                if(anzureki.toString().includes("8"))
                    {
                        if(Math.random()<0.1) //乱数を使って10%の確率で????を製造し、投げます。
                        {
                         gen_gold();
                        } 
                        if(Math.random()<0.2)
                            {
                                gen_kuroan();
                                gen_gold();
                            }

                    }
                }
        }, 500);
        timer=setInterval(()=>
        {
            seigenzikan--;//制限時間を1減らしています
            if(seigenzikan<=0)
            {
                osimai(); //ゼロになればおしまいです!非常容易!
            }
        }
        ,1000);//1secで更新
        }

        //終了処理。
        function osimai()
        {
        bgm.pause();
        bgm.currentTime=0;
         clearInterval(ginterval);
         clearInterval(generateinterval);
         clearInterval(timer);//タイマー系全て、ここでタイマーストップ。 あと初期化

         anzureki++;//あんず歴を更新
         localStorage.setItem("anzureki",anzureki);

         if(kosuu>bestanzukosuu)
         {
          bestanzukosuu=kosuu;
          localStorage.setItem("bestanzukosuu",bestanzukosuu);
         }
if(yarikomi2!=1)
{
         if(kosuu>=40)
            {
                alert("やりこみレベルが上がりました!: 40コ以上あんずを食べた!");
             yarikomi2=1;
             localStorage.setItem("yarikomi2",yarikomi2);
            }
        }

        if(yarikomi3!=1)
            {
            if(kosuu>=50)
                {
                    alert("やりこみレベルが上がりました!: 50コ以上あんずを食べた!(上限)");
                 yarikomi3=1;
                 localStorage.setItem("yarikomi3",yarikomi3);
                }
            }

if(yarikomi4!=1)
{
         if(kosuu<=-5)
           {
            alert("やりこみレベルが上がりました!: -5コ以下あんずを食べた!(下限)");
           yarikomi4=1;
           localStorage.setItem("yarikomi4",yarikomi4);
           }
        }

        if(yarikomi5!=1)
            {
           if(anzureki>=25)
           {
            alert("やりこみレベルが上がりました!: 合計25回チャレンジした!(上限)");
            yarikomi5=1;
            localStorage.setItem("yarikomi5",yarikomi5);
           }
        }

        if(yarikomi7!=1)
            {
           if(anzureki>=10)
            {
             alert("やりこみレベルが上がりました!: 合計10回チャレンジした!");
             yarikomi7=1;
             localStorage.setItem("yarikomi7",yarikomi7);
            }
        }

        if(yarikomi6!=1)
            {
            if(kosuu>=30)
                {
                 alert("やりこみレベルが上がりました!: 30コ以上あんずを食べた!");
                yarikomi6=1;
                localStorage.setItem("yarikomi6",yarikomi6);
                }
            }

         

         if(rev)
         {
            document.getElementById("b2tm").style.display="block";
            document.getElementById("finalreskosuu").innerText=`やったね!\r\nもらえたスマホ:${kosuu}台\r\nI'm glad! I've got ${kosuu} smartphone(s)!`;//!?
         }
         else
         {
            if(kosuu.toString().includes("-1"))
                {
                    if(yarikomi1!=1)
                        {
                            yarikomi1++;//やりこみ要素1を真にセット
                            localStorage.setItem("yarikomi1",yarikomi1);
                            alert("やりこみレベルが上がりました!: 隠し条件(個数に-1が含まれる場合)クリアで秘密のモードを解放した!");
                        }
       document.getElementById("hinamode").style.display="block";
                }
         document.getElementById("finalreskosuu").innerText=`ごちそうさま!\r\n食べたあんず:${kosuu}こ\r\nI'm full! I've had ${kosuu} apricot(s)!`;//これであんずの個数が結果表示されます
         }
         document.getElementById("res").style.display="block";//divを表示
         if(rev)
            {
                const postingtxt=`今回は${kosuu}台 スマホをもらえました!   #あんずはあんずが食べたい https://yokochayokoha.github.io/anzu/`; //!!!???
                const gen_url=`https://x.com/intent/tweet?text=${encodeURIComponent(postingtxt)}`;
                //CoffeeブラウザーでもCoffeeSubでも使っているURIエンコードをしてます。(最近の端末ならしなくてもいいのですが、古いのだとしないと動いてくれません...)
                document.getElementById("sender").href=gen_url;//ここでURLセット!
            }
         else
         {
         const postingtxt=`今回は${kosuu}こ あんずを食べました! ごちそうさま! #あんずはあんずが食べたい https://yokochayokoha.github.io/anzu/`;
         //投稿用テキスト生成。 英語版なくてごめんなさいっ!!  #AnzuWantsToEatAnzu
         const gen_url=`https://x.com/intent/tweet?text=${encodeURIComponent(postingtxt)}`;
         //CoffeeブラウザーでもCoffeeSubでも使っているURIエンコードをしてます。(最近の端末ならしなくてもいいのですが、古いのだとしないと動いてくれません...)
         document.getElementById("sender").href=gen_url;//ここでURLセット!
         }

rirekisansyou();

        }
 

       




        //基礎的動作 マウスで動かせるように
        canvas.addEventListener("mousemove",(e)=>//e=値が入ってます
        {
            const rect=canvas.getBoundingClientRect();//画面サイズ、位置を取得し、rect (retangular)にしまっておきます。
            //でもこのゲームの場合、form(canvas)は最大限大きくなる仕様なので、rect.top(canvas上部とページ上部の隙間)は0になり、あんまり意味ないです。
            //どこかに埋め込むときとかに効力を発揮してくれるかもしれないですね!
            anzuY=e.clientY-rect.top-anzuchansizetate/2; //杏子ちゃんY位置=マウスY位置-(HTML全体表示窓高さ-Canvasの上部の高さ[画面最上部とCanvasの上の隙間 alignに活用])-杏子ちゃんの中心Y(真ん中とマウスを追従させるため)


      }
        );
        

         //その1 あれ、スマホで動いてくれなぃ!!! のworkaround
         canvas.addEventListener("touchmove",(e)=>
         {
            const rect=canvas.getBoundingClientRect();
            anzuY=e.touches[0].clientY-rect.top-anzuchansizetate/2; //杏子ちゃんY位置=指Y位置-(HTML全体表示窓高さ-Canvasの上部の高さ[画面最上部とCanvasの上の隙間 alignに活用])-杏子ちゃんの中心Y(真ん中と指を追従させるため)

         },{passive:false});//結論:マウスとタッチは別物!
 canvas.addEventListener("touchstart",(e)=>
    {
       e.preventDefault();//ウェブページスクロール無視
    },{passive:false});//ウェブページスクロール無視(ここではりんご対策)
         //その2 ぎゃー、タッチはできるけど指押しながら上下できない!!!
         window.onscroll=()=> //今回は引数で受け取らないため、()。また、関数ではなく(Not function) 関数代入用プロパティなのでwindow.onscroll(()=>{});とせずに、=()=>。
         {
            const rect=canvas.getBoundingClientRect();
            anzuY=window.scrollY+window.innerHeight/2-rect.top-anzuchansizetate/2;
            //スクロールの長さ+[画面中央の高度(Y)-(HTML全体表示窓高さ-Canvasの上部の高さ[画面最上部とCanvasの上の隙間])]-杏子ちゃんの中心Y(真ん中と指を追従させるため)
            //[]はどこからスクロールしても中心から始めるようにできるが、この場合はtouchmove優先なので、意味なし!

         };

         //その3 リトライするのにわざわざリロードしていたら通信料肥大化する!! の解決策
         document.getElementById("retry").addEventListener("click",()=>
        {
            beginplay();
            bgm.volume=0.1;
            bgm.loop=true;
            bgm.play();
        }
        );

        //ゲーム開始用
        document.getElementById("kaisisuru").addEventListener("click",()=>
        {
            document.getElementById("sta").style.display="none";
            beginplay();
            bgm.volume=0.1;
            bgm.loop=true;
            bgm.play();


            //本当はここにスタート画面を入れるつもりはなかったけど、PCで遊ぶときにクリックをプレイ前に1回しないと
            //効果音が出ないっていう自動再生ポリシーに関連したバグが起きてしまうので急遽入れました!
                    }
        );

//画面回転、サイズ変更に追従しない!!　のworkaround
        function responsive()
{
    var wid=window.innerWidth;
    var hei=window.innerHeight;
    canvas.setAttribute('width',wid);
    canvas.setAttribute('height',hei);
    
}
window.addEventListener('resize',responsive);
responsive();




document.getElementById("hinamode").addEventListener("click",()=>
    {
anzustate=hinafutsu;
        rev=true;
        beginplay();
        bgm.volume=0.1;
        bgm.loop=true;
        bgm.play();
    }
    );

    document.getElementById("b2tm").addEventListener("click",()=>
        {
            anzustate=futsu;
    document.getElementById("b2tm").style.display="none";
            rev=false;
            beginplay();
            bgm.volume=0.1;
            bgm.loop=true;
            bgm.play();
        }
        );

        document.getElementById("resetsuru").addEventListener("click",()=>
            {
          console.log("[Dev Msg]Reset by user");
            localStorage.clear();
            anzureki=0;
            alert("履歴データをすべて削除しました。");
                }
            );
    
            function rirekisansyou()
            {
                document.getElementById("counter").innerText=`${anzureki}回/times`;
                document.getElementById("best").innerText=`${bestanzukosuu}コ/apricot(s)`;  
                let dosuu=yarikomi1+yarikomi2+yarikomi3+yarikomi4+yarikomi5+yarikomi6+yarikomi7; 
                document.getElementById("nazo").innerText=`${dosuu}段階/grade`;  
                if(dosuu>=7)
                    {
                       
                                yarikomikanryo++;
                                localStorage.setItem("yarikomikanryo",yarikomikanryo);
                            
                        document.getElementById("nazo").innerText=`7段階すべてコンプリートしたので、没案にした未調整の秘密の要素がゲームに登場します!高得点目指して頑張ってください!そして、ここまで遊んでくれて本当にありがとう!!開発者の私は喜んでます!  All 7 levels have been completed and the secret elements (Unajusted unused data,and program) is now in the game! Good luck with your high score! And thank you so much for playing this far! I, the developer, am delighted!  ----Message by 横茶横葉(YokochaYokoha)!`;  
                    }            
            }
