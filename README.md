# Webサイト：photographer YAMADA TARO

## 概要

Hello Mentor のコーディング課題として制作した、架空のフォトグラファー『YAMADA TARO』のポートフォリオサイトです。提供されたFigma デザインカンプからコーディングをしました。

※この課題は JavaScript の解答コードが提供されておらず、設計・実装はすべて自身で行いました。

## URL

https://portfolio.itsseiya.com/photographer-yamada-taro/

## 使用技術

-   HTML5 / CSS3
-   SCSS
-   JavaScript (ES Modules, Web Animations API)

## 工夫した点

-   JS の Web Animations API を使用してアニメーション実装
-   JavaScript をモジュール化し、機能ごとに分割して管理 
-   Vanilla JSによるカルーセル機能の実装
-   Vanilla JSでlightbox機能（画像クリックで拡大表示）の実装。
-   ライトボックス展開する画像に虫眼鏡アイコンを載せ、クリック出来ることを視覚化。
-   lightbox内でスワイプ操作により画像を切り替え（モバイル対応）
-   lightbox内で、← / → キーによる画像切り替え、escキーでの閉じる
-   top-worksのlightboxはgalleryと連携するためにページ内他の画像とは別コードで実装。
  
