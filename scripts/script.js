// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Chat
const chat = document.getElementById('chat');
const input = document.getElementById('chat-message');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
  const p = document.createElement('p');
  p.textContent = text;
  p.className = sender;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

setTimeout(() => {
  addMessage('Olá! Sou sua assistente de emagrecimento com IA. Como posso ajudar você hoje?', 'bot');
}, 1000);

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  input.value = '';

  const typingMsg = document.createElement('p');
  typingMsg.textContent = 'IA está digitando...';
  typingMsg.className = 'bot';
  typingMsg.style.opacity = '0.6';
  chat.appendChild(typingMsg);
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {
    typingMsg.remove();
    addMessage("Ótima pergunta! Vou te ajudar com isso. 😊", 'bot');
  }, 1000);
}

// Enviar formulário
document.getElementById('lead-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const numero = document.getElementById('numero').value;

  try {
    const resposta = await fetch("https://n8n.srv880765.hstgr.cloud/webhook/receber-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, mensagem: numero })
    });

    await resposta.json();

    alert(`Obrigado, ${nome}! Agora você será redirecionado para efetuar o pagamento e entrar no grupo.`);

    document.getElementById("ia").scrollIntoView({ behavior: 'smooth' });

    // Opcional: enviar a mesma info novamente, reforçando na Supabase
    await fetch("https://n8n.srv880765.hstgr.cloud/webhook/receber-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, mensagem: numero })
    });

    // Redirecionar para o pagamento
    window.open("https://mpago.la/2TSij5j", "_blank");

  } catch (error) {
    alert('Erro ao enviar seus dados. Tente novamente mais tarde.');
    console.error(error);
  }
});

// Clique no botão de pagamento também envia o lead (reforçando Supabase)
document.querySelector('#botao-pagamento a').addEventListener('click', async function () {
  const nome = this.parentElement.dataset.nome;
  const email = this.parentElement.dataset.email;
  const numero = this.parentElement.dataset.numero;

  try {
    await fetch("https://n8n.srv880765.hstgr.cloud/webhook/receber-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, mensagem: numero })
    });

    // Não precisa fazer nada aqui, apenas envia o lead de novo.

  } catch (error) {
    console.error('Erro ao reenviar lead no clique do botão:', error);
  }
});

// Efeito visual do cursor
document.addEventListener('mousemove', (e) => {
  let cursor = document.querySelector('.cursor');
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, var(--primary-green) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.3;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);
  }

  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});
