export const modernTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Moderna</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        .btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="card">
        <h1>🚀 Hola Mundo</h1>
        <p style="color: #666; margin-bottom: 30px;">Bienvenido a tu nueva página web moderna</p>
        <button class="btn">Comenzar</button>
    </div>
</body>
</html>`

export const portfolioTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 20px;
            text-align: center;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            border-top: 4px solid #6366f1;
        }
        .card:hover { 
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(99,102,241,0.2);
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>👋 Soy [Tu Nombre]</h1>
        <p style="font-size: 1.3rem;">Desarrollador Web Creativo</p>
    </div>
    
    <div class="container">
        <h2 style="text-align: center; margin-bottom: 20px;">Mis Proyectos</h2>
        <div class="grid">
            <div class="card">
                <h3>🚀 Proyecto 1</h3>
                <p>Descripción del proyecto increíble que desarrollé</p>
            </div>
            <div class="card">
                <h3>🎨 Proyecto 2</h3>
                <p>Otro proyecto fantástico con diseño moderno</p>
            </div>
            <div class="card">
                <h3>⚡ Proyecto 3</h3>
                <p>Aplicación web rápida y eficiente</p>
            </div>
        </div>
    </div>
</body>
</html>`

export const defaultTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Documento HTML</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.7;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 20px;
            text-align: center;
        }
        .highlight {
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            padding: 20px;
            border-radius: 15px;
            margin: 30px 0;
            border-left: 5px solid #6366f1;
            box-shadow: 0 10px 30px rgba(99,102,241,0.2);
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            border-top: 3px solid #6366f1;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(99,102,241,0.2);
        }
        .emoji {
            font-size: 2rem;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Editor HTML Moderno</h1>
        <p style="text-align: center; font-size: 1.2rem; color: #666; margin-bottom: 40px;">
            Crea, edita y visualiza tu código HTML con estilo
        </p>
        
        <div class="highlight">
            <strong>✨ ¡Bienvenido!</strong> Este editor combina potencia y elegancia para tu desarrollo web.
        </div>
        
        <div class="feature-grid">
            <div class="feature-card">
                <div class="emoji">⚡</div>
                <h3>Editor en Tiempo Real</h3>
                <p>Escribe código y ve los cambios instantáneamente</p>
            </div>
            <div class="feature-card">
                <div class="emoji">📁</div>
                <h3>Importación Fácil</h3>
                <p>Arrastra y suelta tus archivos HTML</p>
            </div>
            <div class="feature-card">
                <div class="emoji">🎨</div>
                <h3>Plantillas Modernas</h3>
                <p>Comienza con diseños profesionales</p>
            </div>
            <div class="feature-card">
                <div class="emoji">💾</div>
                <h3>Exportación Rápida</h3>
                <p>Descarga tu trabajo al instante</p>
            </div>
        </div>
        
        <p style="text-align: center; margin-top: 40px; color: #888;">
            ¡Comienza a crear algo increíble! 🎯
        </p>
    </div>
</body>
</html>`
