from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
from datetime import datetime

app = FastAPI(title="Football News API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "football_news.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_en TEXT NOT NULL,
            title_fr TEXT NOT NULL,
            title_ar TEXT NOT NULL,
            summary_en TEXT NOT NULL,
            summary_fr TEXT NOT NULL,
            summary_ar TEXT NOT NULL,
            content_en TEXT NOT NULL,
            content_fr TEXT NOT NULL,
            content_ar TEXT NOT NULL,
            category TEXT NOT NULL,
            image_url TEXT,
            created_at TEXT NOT NULL
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            author TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles(id)
        )
    """)
    cur.execute("SELECT COUNT(*) FROM articles")
    if cur.fetchone()[0] == 0:
        seed_articles(cur)
    conn.commit()
    conn.close()


def seed_articles(cur):
    articles = [
        {
            "title_en": "Real Madrid Win Champions League Final in Thrilling Comeback",
            "title_fr": "Le Real Madrid remporte la finale de la Ligue des Champions au terme d'un retour spectaculaire",
            "title_ar": "ريال مدريد يفوز بنهائي دوري أبطال أوروبا في عودة مثيرة",
            "summary_en": "Real Madrid overcame a two-goal deficit to claim their 15th Champions League title in a dramatic final.",
            "summary_fr": "Le Real Madrid a surmonté un déficit de deux buts pour remporter son 15e titre en Ligue des Champions lors d'une finale dramatique.",
            "summary_ar": "تغلّب ريال مدريد على تأخر بهدفين ليحرز لقب دوري أبطال أوروبا للمرة الخامسة عشرة في نهائي مثير للدراما.",
            "content_en": "In one of the most memorable Champions League finals in recent history, Real Madrid staged a stunning comeback to defeat their opponents 3-2. Trailing 2-0 at halftime, manager Carlo Ancelotti made bold tactical changes that completely transformed the game. Jude Bellingham opened the scoring with a brilliant volley before Vinícius Júnior netted twice to complete the remarkable turnaround. The Bernabéu faithful erupted in celebrations that lasted well into the night. This victory cements Real Madrid's status as the greatest club in European football history.",
            "content_fr": "Lors de l'une des finales de Ligue des Champions les plus mémorables, le Real Madrid a réalisé un retour spectaculaire pour battre ses adversaires 3-2. Menés 2-0 à la mi-temps, l'entraîneur Carlo Ancelotti a effectué des changements tactiques audacieux. Jude Bellingham a ouvert le score avec une magnifique volée avant que Vinícius Júnior ne marque deux fois pour compléter ce remarquable renversement de situation. Cette victoire cimente le statut du Real Madrid comme le plus grand club de l'histoire du football européen.",
            "content_ar": "في واحدة من أكثر نهائيات دوري أبطال أوروبا إثارةً في التاريخ الحديث، أجرى ريال مدريد عودة مذهلة لهزيمة خصومه 3-2. بعد التأخر 0-2 في الشوط الأول، أجرى المدير الفني كارلو أنشيلوتي تغييرات تكتيكية جريئة. افتتح جود بيلينغهام التسجيل بتسديدة طائرة رائعة قبل أن يسجل فينيسيوس جونيور هدفين. تُعزّز هذه الانتصار مكانة ريال مدريد بوصفه أعظم نادٍ في تاريخ كرة القدم الأوروبية.",
            "category": "Champions League",
            "image_url": "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&auto=format",
            "created_at": "2025-05-28T21:00:00"
        },
        {
            "title_en": "Erling Haaland Breaks Premier League Scoring Record",
            "title_fr": "Erling Haaland bat le record de buts en Premier League",
            "title_ar": "إيرلينغ هولاند يكسر رقم التهديف القياسي في الدوري الإنجليزي الممتاز",
            "summary_en": "Manchester City striker Erling Haaland has broken the all-time Premier League scoring record with his 261st goal.",
            "summary_fr": "L'attaquant de Manchester City, Erling Haaland, a battu le record de buts en Premier League avec son 261e but.",
            "summary_ar": "حطّم مهاجم مانشستر سيتي إيرلينغ هولاند الرقم القياسي لأهداف الدوري الإنجليزي الممتاز بتسجيله هدفه رقم 261.",
            "content_en": "Norwegian sensation Erling Haaland has rewritten the history books by surpassing Alan Shearer's long-standing Premier League record of 260 goals. The 24-year-old achieved this milestone in just his third season in English football. Haaland celebrated the record-breaking strike with his trademark meditation pose. Manchester City boss Pep Guardiola called it 'the most natural goalscorer I have ever managed.' The record came in a 4-1 victory over Arsenal at the Etihad Stadium.",
            "content_fr": "La sensation norvégienne Erling Haaland a réécrit les livres d'histoire en dépassant le record de 260 buts d'Alan Shearer en Premier League. L'attaquant de 24 ans a atteint ce jalon lors de sa troisième saison dans le football anglais. L'entraîneur Pep Guardiola a déclaré que c'était le buteur le plus naturel qu'il ait jamais entraîné. Le record est tombé lors d'une victoire 4-1 contre Arsenal.",
            "content_ar": "أعاد النجم النرويجي إيرلينغ هولاند كتابة سجلات التاريخ بتجاوزه رقم ألان شيرر القياسي البالغ 260 هدفًا في الدوري الإنجليزي الممتاز. حقق الشاب البالغ من العمر 24 عامًا هذا الإنجاز في موسمه الثالث فقط. احتفل هولاند بهذه الضربة القياسية بوضعية التأمل المميزة له. جاء الرقم القياسي في الفوز 4-1 على أرسنال في ملعب الإيتيهاد.",
            "category": "Premier League",
            "image_url": "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format",
            "created_at": "2025-05-15T18:30:00"
        },
        {
            "title_en": "World Cup 2026: Group Stage Draw Announced",
            "title_fr": "Coupe du Monde 2026 : Le tirage au sort de la phase de groupes annoncé",
            "title_ar": "كأس العالم 2026: الإعلان عن قرعة دور المجموعات",
            "summary_en": "FIFA has revealed the group stage draw for the 2026 World Cup co-hosted by USA, Canada and Mexico.",
            "summary_fr": "La FIFA a révélé le tirage au sort de la phase de groupes pour la Coupe du Monde 2026 co-organisée par les États-Unis, le Canada et le Mexique.",
            "summary_ar": "كشف الاتحاد الدولي لكرة القدم (فيفا) عن قرعة دور المجموعات لكأس العالم 2026 الذي تستضيفه مشتركةً الولايات المتحدة وكندا والمكسيك.",
            "content_en": "The 2026 FIFA World Cup group stage draw has thrown up some fascinating matchups. The expanded tournament, featuring 48 teams for the first time, will see defending champions Argentina face France and Germany in what promises to be a group of death. Brazil have been drawn alongside England, Spain and Morocco. The tournament runs from June 11 to July 19, 2026, across 16 cities in three countries.",
            "content_fr": "Le tirage au sort de la phase de groupes de la Coupe du Monde FIFA 2026 a donné lieu à des confrontations fascinantes. Le tournoi élargi, accueillant pour la première fois 48 équipes, verra les champions en titre, l'Argentine, affronter la France et l'Allemagne dans ce qui promet d'être un groupe de la mort. Le tournoi se déroulera du 11 juin au 19 juillet 2026.",
            "content_ar": "كشفت قرعة دور المجموعات لكأس العالم 2026 عن مواجهات آسرة. البطولة الموسّعة التي تضم 48 فريقًا لأول مرة ستشهد الأرجنتين حاملة اللقب تواجه فرنسا وألمانيا. تمتد البطولة من 11 يونيو إلى 19 يوليو 2026 في 16 مدينة عبر ثلاث دول.",
            "category": "World Cup",
            "image_url": "https://images.unsplash.com/photo-1551958219-acbc595b4328?w=800&auto=format",
            "created_at": "2025-04-02T14:00:00"
        },
        {
            "title_en": "Kylian Mbappé Named Ballon d'Or Winner for Third Time",
            "title_fr": "Kylian Mbappé nommé vainqueur du Ballon d'Or pour la troisième fois",
            "title_ar": "كيليان مبابي يُتوَّج بجائزة الكرة الذهبية للمرة الثالثة",
            "summary_en": "Paris-born superstar Kylian Mbappé claimed his third Ballon d'Or award in a glittering ceremony in Paris.",
            "summary_fr": "La superstar parisienne Kylian Mbappé a remporté son troisième Ballon d'Or lors d'une cérémonie brillante à Paris.",
            "summary_ar": "أحرز النجم الباريسي كيليان مبابي جائزة الكرة الذهبية للمرة الثالثة في حفل بهيج في باريس.",
            "content_en": "Kylian Mbappé has cemented his place among football's all-time greats by claiming his third Ballon d'Or award. The French superstar, who led Real Madrid to Champions League glory and guided France to the World Cup final, received the prestigious award at a ceremony at the Théâtre du Châtelet in Paris. Mbappé, 27, beat Bellingham and Vinicius Junior in the voting.",
            "content_fr": "Kylian Mbappé a consolidé sa place parmi les plus grands joueurs de tous les temps en remportant son troisième Ballon d'Or. La superstar française a reçu ce prestigieux trophée lors d'une cérémonie au Théâtre du Châtelet à Paris. Mbappé, 27 ans, a devancé Bellingham et Vinícius Junior dans le vote.",
            "content_ar": "رسّخ كيليان مبابي مكانته بين أعظم لاعبي كرة القدم بفوزه بجائزة الكرة الذهبية للمرة الثالثة. استلم النجم الفرنسي هذه الجائزة في حفل في مسرح شاتليه بباريس. تفوّق مبابي (27 عامًا) على بيلينغهام وفينيسيوس جونيور في التصويت.",
            "category": "Awards",
            "image_url": "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&auto=format",
            "created_at": "2025-10-28T20:00:00"
        },
        {
            "title_en": "Barcelona Sign 18-Year-Old Wonderkid for Record Fee",
            "title_fr": "Barcelone signe un jeune prodige de 18 ans pour un montant record",
            "title_ar": "برشلونة يوقّع عقدًا مع موهبة شابة تبلغ 18 عامًا بقيمة قياسية",
            "summary_en": "FC Barcelona have broken the transfer record for a teenager by signing Brazilian sensation Mateus Costa for €180m.",
            "summary_fr": "Le FC Barcelone a battu le record de transfert pour un teenager en signant la sensation brésilienne Mateus Costa pour 180 millions d'euros.",
            "summary_ar": "كسر نادي برشلونة الرقم القياسي لانتقالات الناشئين بالتعاقد مع الموهبة البرازيلية ماتيوس كوستا مقابل 180 مليون يورو.",
            "content_en": "FC Barcelona have made a statement of intent by signing Brazilian teenage sensation Mateus Costa in a deal worth 180 million euros. The 18-year-old winger, who dazzled at the Copa América, signed a six-year deal with a release clause of 500 million euros. Barcelona president Joan Laporta said Mateus is the future of football.",
            "content_fr": "Le FC Barcelone a affiché ses intentions en signant la sensation brésilienne Mateus Costa pour 180 millions d'euros. L'ailier de 18 ans a signé un contrat de six ans avec une clause libératoire de 500 millions d'euros. Le président Laporta a déclaré que Mateus est l'avenir du football.",
            "content_ar": "أعلن نادي برشلونة عن توقيعه مع الموهبة البرازيلية الشابة ماتيوس كوستا في صفقة بقيمة 180 مليون يورو. وقّع الجناح البالغ من العمر 18 عامًا عقدًا لمدة ست سنوات بشرط جزائي يبلغ 500 مليون يورو. قال رئيس برشلونة لابورتا إن ماتيوس هو مستقبل كرة القدم.",
            "category": "Transfers",
            "image_url": "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format",
            "created_at": "2025-07-01T10:00:00"
        },
        {
            "title_en": "Africa Cup of Nations: Morocco Crowned Champions",
            "title_fr": "Coupe d'Afrique des Nations : Le Maroc sacré champion",
            "title_ar": "كأس أمم أفريقيا: المغرب يتوّج باللقب",
            "summary_en": "Morocco claimed their first AFCON title in dramatic fashion, beating Nigeria on penalties in the final.",
            "summary_fr": "Le Maroc a remporté son premier titre à la CAN de manière dramatique, battant le Nigeria aux tirs au but en finale.",
            "summary_ar": "توّج المغرب بلقب كأس أمم أفريقيا للمرة الأولى في تاريخه، إذ تغلّب على نيجيريا بركلات الترجيح في النهائي.",
            "content_en": "Morocco have ended their long wait for continental glory by winning the Africa Cup of Nations for the first time. The Atlas Lions beat Nigeria 4-3 on penalties after a 1-1 draw in the final held in Casablanca. Captain Achraf Hakimi converted the crucial spot kick to spark wild celebrations. Coach Walid Regragui said it was the greatest achievement in Moroccan football history.",
            "content_fr": "Le Maroc a mis fin à sa longue attente de gloire continentale en remportant la Coupe d'Afrique des Nations pour la première fois. Les Lions de l'Atlas ont battu le Nigéria 4-3 aux tirs au but après un match nul 1-1 en finale à Casablanca. Le capitaine Achraf Hakimi a transformé le tir au but décisif. L'entraîneur Regragui a déclaré que c'était la plus grande réalisation du football marocain.",
            "content_ar": "أنهى المغرب انتظاره الطويل للمجد القاري بالفوز بكأس أمم أفريقيا لأول مرة. تغلّب أسود الأطلس على نيجيريا 4-3 بركلات الترجيح بعد تعادل 1-1 في النهائي بالدار البيضاء. سدّد الكابتن أشرف حكيمي الركلة الحاسمة. قال المدرب الركراكي إنه أعظم إنجاز في تاريخ كرة القدم المغربية.",
            "category": "AFCON",
            "image_url": "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&auto=format",
            "created_at": "2025-02-14T21:30:00"
        },
        {
            "title_en": "PSG Dominate Ligue 1 with Record Points Tally",
            "title_fr": "Le PSG domine la Ligue 1 avec un record de points",
            "title_ar": "باريس سان جيرمان يهيمن على الدوري الفرنسي بأعلى رصيد نقاط في التاريخ",
            "summary_en": "Paris Saint-Germain clinched the Ligue 1 title with six games to spare, breaking multiple records.",
            "summary_fr": "Le Paris Saint-Germain a remporté le titre de Ligue 1 avec six matchs d'avance, battant plusieurs records.",
            "summary_ar": "حسم باريس سان جيرمان لقب الدوري الفرنسي قبل ست جولات من نهاية البطولة، محطّمًا عدة أرقام قياسية.",
            "content_en": "Paris Saint-Germain delivered another dominant Ligue 1 season, clinching the title with a record 98 points from 38 games. The Parisian giants scored an astonishing 112 goals. New coach Luis Enrique transformed the team into a cohesive attacking unit. PSG's title win was celebrated by thousands of fans on the Champs-Élysées.",
            "content_fr": "Le Paris Saint-Germain a livré une autre saison dominante en Ligue 1, remportant le titre avec un record de 98 points en 38 matchs. Les géants parisiens ont inscrit un étonnant 112 buts. Le nouvel entraîneur Luis Enrique a transformé l'équipe en une unité d'attaque cohésive.",
            "content_ar": "قدّم باريس سان جيرمان موسمًا مهيمنًا آخر في الدوري الفرنسي، محققًا اللقب برصيد قياسي بلغ 98 نقطة من 38 مباراة. سجّل العملاق الباريسي 112 هدفًا مذهلًا. حوّل المدرب الجديد لويس إنريكي الفريق إلى وحدة هجومية متماسكة.",
            "category": "Ligue 1",
            "image_url": "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&auto=format",
            "created_at": "2025-04-20T17:00:00"
        }
    ]
    for a in articles:
        cur.execute(
            "INSERT INTO articles (title_en,title_fr,title_ar,summary_en,summary_fr,summary_ar,"
            "content_en,content_fr,content_ar,category,image_url,created_at) "
            "VALUES (:title_en,:title_fr,:title_ar,:summary_en,:summary_fr,:summary_ar,"
            ":content_en,:content_fr,:content_ar,:category,:image_url,:created_at)",
            a
        )


class CommentCreate(BaseModel):
    author: str
    content: str


@app.on_event("startup")
def startup():
    init_db()


@app.get("/articles")
def list_articles(lang: str = "en"):
    l = lang if lang in ("en", "fr", "ar") else "en"
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, title_{l} as title, summary_{l} as summary, "
        "category, image_url, created_at FROM articles ORDER BY created_at DESC"
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


@app.get("/articles/{article_id}")
def get_article(article_id: int, lang: str = "en"):
    l = lang if lang in ("en", "fr", "ar") else "en"
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, title_{l} as title, summary_{l} as summary, "
        f"content_{l} as content, category, image_url, created_at "
        "FROM articles WHERE id = ?", (article_id,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Article not found")
    return dict(row)


@app.get("/articles/{article_id}/comments")
def get_comments(article_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, author, content, created_at FROM comments "
        "WHERE article_id = ? ORDER BY created_at ASC", (article_id,)
    )
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


@app.post("/articles/{article_id}/comments", status_code=201)
def add_comment(article_id: int, comment: CommentCreate):
    if not comment.author.strip() or not comment.content.strip():
        raise HTTPException(status_code=400, detail="Author and content are required")
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM articles WHERE id = ?", (article_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Article not found")
    now = datetime.utcnow().isoformat()
    cur.execute(
        "INSERT INTO comments (article_id, author, content, created_at) VALUES (?, ?, ?, ?)",
        (article_id, comment.author.strip(), comment.content.strip(), now)
    )
    conn.commit()
    cid = cur.lastrowid
    conn.close()
    return {"id": cid, "author": comment.author.strip(), "content": comment.content.strip(), "created_at": now}
