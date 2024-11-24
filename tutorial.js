const canvas=document.getElementById("form2");
const benrikit=canvas.getContext("2d");
const futsu=new Image();//インスタンス的にimage属性を付与(勝手な理解)
futsu.src="1.png";//imageの内容を描いた画像にセット。(普通の表情をした杏子さん)
const kuchiake=new Image();//インスタンス的にimage属性を付与(勝手な理解)
kuchiake.src="3.png";
const anzuchansizeyoko=200;//左側から覗いている唐桃杏子さんの画像の横サイズ
const anzuchansizetate=200;
let anzuX=0;//杏子さんはx=0の場所に現れます。
let anzuY=canvas.height/2 - anzuchansizetate/2;
let anzustate=futsu;
let ginterval;
update();
ginterval=setInterval(()=>
    {
        update();

    },1000 / 60);

function update()
{
    benrikit.clearRect(0,0,canvas.width,canvas.height);//新しいフレームを表示するため、前の描画データを消します。
    benrikit.drawImage(anzustate,anzuX,anzuY,anzuchansizeyoko,anzuchansizetate);
}

canvas.addEventListener("mousemove",(e)=>//e=値が入ってます
{
    const rect=canvas.getBoundingClientRect();//画面サイズ、位置を取得し、rect (retangular)にしまっておきます。
    //でもこのゲームの場合、form(canvas)は最大限大きくなる仕様なので、rect.top(canvas上部とページ上部の隙間)は0になり、あんまり意味ないです。
    //どこかに埋め込むときとかに効力を発揮してくれるかもしれないですね!
    anzuY=e.clientY-rect.top-anzuchansizetate/2; //杏子ちゃんY位置=マウスY位置-(HTML全体表示窓高さ-Canvasの上部の高さ[画面最上部とCanvasの上の隙間 alignに活用])-杏子ちゃんの中心Y(真ん中とマウスを追従させるため)


}
);
canvas.addEventListener("click",()=>//遊び心です!
{
    if(anzustate!=kuchiake)
    {
anzustate=kuchiake;
    }
    else
    {
        anzustate=futsu;
    }
update();
});

 //その1 あれ、スマホで動いてくれなぃ!!! のworkaround
 canvas.addEventListener("touchmove",(e)=>
 {
    e.preventDefault();//ウェブページスクロール無視

    const rect=canvas.getBoundingClientRect();
    anzuY=e.touches[0].clientY-rect.top-anzuchansizetate/2; //杏子ちゃんY位置=指Y位置-(HTML全体表示窓高さ-Canvasの上部の高さ[画面最上部とCanvasの上の隙間 alignに活用])-杏子ちゃんの中心Y(真ん中と指を追従させるため)

 },{passive:false});//ウェブページスクロール無視

 canvas.addEventListener("touchstart",(e)=>
    {
       e.preventDefault();//ウェブページスクロール無視
    },{passive:false});//ウェブページスクロール無視

 //その2 ぎゃー、タッチはできるけど指押しながら上下できない!!!
 window.onscroll=()=> //今回は引数で受け取らないため、()。また、関数ではなく(Not function) 関数代入用プロパティなのでwindow.onscroll(()=>{});とせずに、=()=>。
 {
    const rect=canvas.getBoundingClientRect();
    anzuY=window.scrollY+window.innerHeight/2-rect.top-anzuchansizetate/2;
    //スクロールの長さ+[画面中央の高度(Y)-(HTML全体表示窓高さ-Canvasの上部の高さ[画面最上部とCanvasの上の隙間])]-杏子ちゃんの中心Y(真ん中と指を追従させるため)
    //[]はどこからスクロールしても中心から始めるようにできるが、この場合はtouchmove優先なので、意味なし!

 };