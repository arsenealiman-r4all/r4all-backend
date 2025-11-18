// Main admin dashboard application
const app = {
  currentSection: 'dashboard',
  user: null,
  stats: {},
  
  init: async function() {
    await this.checkAuth();
    this.render();
    this.attachEventListeners();
  },
  
  checkAuth: async function() {
    try {
      const response = await axios.get('/api/auth/check');
      if (!response.data.authenticated) {
        window.location.href = '/login';
        return;
      }
      this.user = response.data.user;
    } catch (error) {
      window.location.href = '/login';
    }
  },
  
  logout: async function() {
    try {
      await axios.post('/api/auth/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  render: function() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
      <div class="flex h-screen bg-gray-50">
        <!-- Sidebar -->
        <aside class="w-64 gradient-bg text-white">
          <div class="p-6">
            <h1 class="text-2xl font-bold mb-1">Renergy4all</h1>
            <p class="text-sm opacity-80">Backoffice</p>
          </div>
          
          <nav class="mt-6">
            <a href="#" data-section="dashboard" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-home w-6"></i> Tableau de bord
            </a>
            <a href="#" data-section="hero" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-image w-6"></i> Hero Section
            </a>
            <a href="#" data-section="services" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-cogs w-6"></i> Services
            </a>
            <a href="#" data-section="projects" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-project-diagram w-6"></i> Projets
            </a>
            <a href="#" data-section="blog" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-blog w-6"></i> Blog
            </a>
            <a href="#" data-section="events" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-calendar w-6"></i> Événements
            </a>
            <a href="#" data-section="partners" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-handshake w-6"></i> Partenaires
            </a>
            <a href="#" data-section="courses" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-graduation-cap w-6"></i> Académie
            </a>
            <a href="#" data-section="values" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-star w-6"></i> Valeurs
            </a>
            <a href="#" data-section="contact" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-envelope w-6"></i> Messages
            </a>
            <a href="#" data-section="config" class="sidebar-link block px-6 py-3 hover:bg-white/10">
              <i class="fas fa-sliders-h w-6"></i> Configuration
            </a>
          </nav>
          
          <div class="absolute bottom-0 w-64 p-6 border-t border-white/20">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fas fa-user"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">${this.user?.name || 'Admin'}</p>
                <p class="text-xs opacity-70">${this.user?.email || ''}</p>
              </div>
            </div>
            <button id="logoutBtn" class="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
              <i class="fas fa-sign-out-alt mr-2"></i> Déconnexion
            </button>
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto">
          <header class="bg-white shadow-sm">
            <div class="px-8 py-4 flex items-center justify-between">
              <h2 id="sectionTitle" class="text-2xl font-bold text-gray-800">Tableau de bord</h2>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </header>
          
          <div id="content" class="p-8">
            ${this.renderDashboard()}
          </div>
        </main>
      </div>
    `;
  },
  
  renderDashboard: function() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 text-sm font-medium">Services</h3>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-cogs text-blue-600 text-xl"></i>
            </div>
          </div>
          <p id="servicesCount" class="text-3xl font-bold text-gray-800">-</p>
          <p class="text-sm text-gray-500 mt-2">Services actifs</p>
        </div>
        
        <div class="card bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 text-sm font-medium">Projets</h3>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-project-diagram text-green-600 text-xl"></i>
            </div>
          </div>
          <p id="projectsCount" class="text-3xl font-bold text-gray-800">-</p>
          <p class="text-sm text-gray-500 mt-2">Projets en cours</p>
        </div>
        
        <div class="card bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 text-sm font-medium">Articles Blog</h3>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-blog text-purple-600 text-xl"></i>
            </div>
          </div>
          <p id="blogCount" class="text-3xl font-bold text-gray-800">-</p>
          <p class="text-sm text-gray-500 mt-2">Articles publiés</p>
        </div>
        
        <div class="card bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-600 text-sm font-medium">Messages</h3>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-envelope text-red-600 text-xl"></i>
            </div>
          </div>
          <p id="messagesCount" class="text-3xl font-bold text-gray-800">-</p>
          <p class="text-sm text-gray-500 mt-2">Messages non lus</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Bienvenue</h3>
          <p class="text-gray-600 mb-4">
            Bienvenue dans le backoffice de Renergy4all. Utilisez le menu de gauche pour gérer les différentes sections de votre site.
          </p>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p class="text-blue-800 text-sm">
              <i class="fas fa-info-circle mr-2"></i>
              Toutes les modifications sont sauvegardées en temps réel dans la base de données.
            </p>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Actions rapides</h3>
          <div class="space-y-3">
            <button data-section="services" class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
              <span><i class="fas fa-plus-circle mr-3 text-blue-600"></i>Ajouter un service</span>
              <i class="fas fa-arrow-right text-gray-400"></i>
            </button>
            <button data-section="projects" class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
              <span><i class="fas fa-plus-circle mr-3 text-green-600"></i>Créer un projet</span>
              <i class="fas fa-arrow-right text-gray-400"></i>
            </button>
            <button data-section="blog" class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
              <span><i class="fas fa-plus-circle mr-3 text-purple-600"></i>Rédiger un article</span>
              <i class="fas fa-arrow-right text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  loadDashboardStats: async function() {
    try {
      const [services, projects, blog, messages] = await Promise.all([
        axios.get('/api/services/admin/all'),
        axios.get('/api/projects/admin/all'),
        axios.get('/api/blog/admin/all'),
        axios.get('/api/contact/admin/unread-count')
      ]);
      
      document.getElementById('servicesCount').textContent = services.data.services?.length || 0;
      document.getElementById('projectsCount').textContent = projects.data.projects?.filter(p => p.status === 'en_cours').length || 0;
      document.getElementById('blogCount').textContent = blog.data.posts?.filter(p => p.is_published).length || 0;
      document.getElementById('messagesCount').textContent = messages.data.count || 0;
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  },
  
  attachEventListeners: function() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-link, [data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        if (section) {
          this.navigateToSection(section);
        }
      });
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logout();
    });
    
    // Load dashboard stats if on dashboard
    if (this.currentSection === 'dashboard') {
      this.loadDashboardStats();
    }
  },
  
  navigateToSection: function(section) {
    this.currentSection = section;
    const contentDiv = document.getElementById('content');
    const titleDiv = document.getElementById('sectionTitle');
    
    // Update title
    const titles = {
      dashboard: 'Tableau de bord',
      hero: 'Hero Section',
      services: 'Services',
      projects: 'Projets',
      blog: 'Blog',
      events: 'Événements',
      partners: 'Partenaires',
      courses: 'Académie',
      values: 'Valeurs',
      contact: 'Messages de contact',
      config: 'Configuration'
    };
    titleDiv.textContent = titles[section] || section;
    
    // Show loading
    contentDiv.innerHTML = '<div class="flex items-center justify-center py-20"><div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div></div>';
    
    // Load section content
    this.loadSection(section);
  },
  
  loadSection: async function(section) {
    const contentDiv = document.getElementById('content');
    
    try {
      switch(section) {
        case 'dashboard':
          contentDiv.innerHTML = this.renderDashboard();
          this.loadDashboardStats();
          this.attachEventListeners();
          break;
        case 'services':
          await this.loadServices();
          break;
        case 'projects':
          await this.loadProjects();
          break;
        case 'blog':
          await this.loadBlog();
          break;
        case 'contact':
          await this.loadMessages();
          break;
        default:
          contentDiv.innerHTML = `
            <div class="bg-white rounded-xl shadow-md p-8 text-center">
              <i class="fas fa-tools text-6xl text-gray-300 mb-4"></i>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">Section en développement</h3>
              <p class="text-gray-600">La section "${section}" sera bientôt disponible.</p>
            </div>
          `;
      }
    } catch (error) {
      console.error('Error loading section:', error);
      contentDiv.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h3 class="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h3>
          <p class="text-red-600">Impossible de charger cette section.</p>
        </div>
      `;
    }
  },
  
  loadServices: async function() {
    const response = await axios.get('/api/services/admin/all');
    const services = response.data.services || [];
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
      <div class="mb-6">
        <button id="addServiceBtn" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg">
          <i class="fas fa-plus mr-2"></i> Ajouter un service
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="servicesList">
        ${services.map(service => `
          <div class="card bg-white rounded-xl shadow-md p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="${service.icon || 'fas fa-cog'} text-blue-600 text-xl"></i>
              </div>
              <span class="px-3 py-1 text-xs font-semibold rounded-full ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                ${service.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">${service.title}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">${service.description || ''}</p>
            <div class="flex space-x-2">
              <button class="editServiceBtn flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition" data-id="${service.id}">
                <i class="fas fa-edit mr-2"></i>Modifier
              </button>
              <button class="deleteServiceBtn bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition" data-id="${service.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${services.length === 0 ? '<div class="text-center py-12 text-gray-500"><i class="fas fa-inbox text-4xl mb-4"></i><p>Aucun service trouvé</p></div>' : ''}
    `;
    
    // Attach event listeners
    document.getElementById('addServiceBtn')?.addEventListener('click', () => this.showServiceModal());
    document.querySelectorAll('.editServiceBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const service = services.find(s => s.id == id);
        this.showServiceModal(service);
      });
    });
    document.querySelectorAll('.deleteServiceBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
          await this.deleteService(id);
        }
      });
    });
  },
  
  showServiceModal: function(service = null) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">${service ? 'Modifier' : 'Ajouter'} un service</h2>
        <form id="serviceForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input type="text" name="title" value="${service?.title || ''}" required
                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" rows="4" 
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent">${service?.description || ''}</textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Icône (Font Awesome)</label>
              <input type="text" name="icon" value="${service?.icon || 'fa-cog'}" placeholder="fa-cog"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
              <input type="number" name="order_index" value="${service?.order_index || 0}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent">
            </div>
          </div>
          
          <div>
            <label class="flex items-center space-x-2">
              <input type="checkbox" name="is_active" ${service?.is_active ? 'checked' : ''} class="rounded">
              <span class="text-sm font-medium text-gray-700">Service actif</span>
            </label>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button type="submit" class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition">
              ${service ? 'Mettre à jour' : 'Créer'}
            </button>
            <button type="button" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition" onclick="this.closest('.fixed').remove()">
              Annuler
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('serviceForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        icon: formData.get('icon'),
        order_index: parseInt(formData.get('order_index')),
        is_active: formData.get('is_active') ? 1 : 0
      };
      
      try {
        if (service) {
          await axios.put(`/api/services/admin/${service.id}`, data);
        } else {
          await axios.post('/api/services/admin', data);
        }
        modal.remove();
        this.loadServices();
      } catch (error) {
        alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
      }
    });
  },
  
  deleteService: async function(id) {
    try {
      await axios.delete(`/api/services/admin/${id}`);
      this.loadServices();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  },
  
  loadProjects: async function() {
    const response = await axios.get('/api/projects/admin/all');
    const projects = response.data.projects || [];
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
      <div class="mb-6">
        <button id="addProjectBtn" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg">
          <i class="fas fa-plus mr-2"></i> Ajouter un projet
        </button>
      </div>
      
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${projects.map(project => `
              <tr>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">${project.title}</div>
                  <div class="text-sm text-gray-500">${project.summary || ''}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  ${project.city || ''}, ${project.country || ''}
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'complete' ? 'bg-green-100 text-green-800' : 
                    project.status === 'en_cours' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }">
                    ${project.status === 'complete' ? 'Terminé' : project.status === 'en_cours' ? 'En cours' : project.status}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  ${project.capacity_kw ? project.capacity_kw + ' kW' : '-'}
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button class="editProjectBtn text-blue-600 hover:text-blue-900" data-id="${project.id}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="deleteProjectBtn text-red-600 hover:text-red-900" data-id="${project.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${projects.length === 0 ? '<div class="text-center py-12 text-gray-500"><p>Aucun projet trouvé</p></div>' : ''}
      </div>
    `;
    
    document.getElementById('addProjectBtn')?.addEventListener('click', () => this.showProjectModal());
    document.querySelectorAll('.editProjectBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const project = projects.find(p => p.id == id);
        this.showProjectModal(project);
      });
    });
    document.querySelectorAll('.deleteProjectBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
          await axios.delete(`/api/projects/admin/${id}`);
          this.loadProjects();
        }
      });
    });
  },
  
  showProjectModal: function(project = null) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-screen overflow-y-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">${project ? 'Modifier' : 'Ajouter'} un projet</h2>
        <form id="projectForm" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input type="text" name="title" value="${project?.title || ''}" required
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Résumé</label>
              <input type="text" name="summary" value="${project?.summary || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pays</label>
              <input type="text" name="country" value="${project?.country || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <input type="text" name="city" value="${project?.city || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select name="status" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
                <option value="en_cours" ${project?.status === 'en_cours' ? 'selected' : ''}>En cours</option>
                <option value="complete" ${project?.status === 'complete' ? 'selected' : ''}>Terminé</option>
                <option value="planifie" ${project?.status === 'planifie' ? 'selected' : ''}>Planifié</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Capacité (kW)</label>
              <input type="number" step="0.1" name="capacity_kw" value="${project?.capacity_kw || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bénéficiaires</label>
              <input type="number" name="beneficiaries" value="${project?.beneficiaries || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL Image</label>
              <input type="url" name="image_url" value="${project?.image_url || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" rows="4" 
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">${project?.description || ''}</textarea>
            </div>
            
            <div class="col-span-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" name="is_active" ${project?.is_active ? 'checked' : ''} class="rounded">
                <span class="text-sm font-medium text-gray-700">Projet actif</span>
              </label>
            </div>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button type="submit" class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition">
              ${project ? 'Mettre à jour' : 'Créer'}
            </button>
            <button type="button" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition" onclick="this.closest('.fixed').remove()">
              Annuler
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('projectForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        description: formData.get('description'),
        country: formData.get('country'),
        city: formData.get('city'),
        status: formData.get('status'),
        capacity_kw: formData.get('capacity_kw') ? parseFloat(formData.get('capacity_kw')) : null,
        beneficiaries: formData.get('beneficiaries') ? parseInt(formData.get('beneficiaries')) : null,
        image_url: formData.get('image_url'),
        is_active: formData.get('is_active') ? 1 : 0
      };
      
      try {
        if (project) {
          await axios.put(`/api/projects/admin/${project.id}`, data);
        } else {
          await axios.post('/api/projects/admin', data);
        }
        modal.remove();
        this.loadProjects();
      } catch (error) {
        alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
      }
    });
  },
  
  loadBlog: async function() {
    const response = await axios.get('/api/blog/admin/all');
    const posts = response.data.posts || [];
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
      <div class="mb-6">
        <button id="addPostBtn" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg">
          <i class="fas fa-plus mr-2"></i> Nouvel article
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${posts.map(post => `
          <div class="card bg-white rounded-xl shadow-md overflow-hidden">
            ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="w-full h-48 object-cover">` : ''}
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <span class="px-3 py-1 text-xs font-semibold rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                  ${post.is_published ? 'Publié' : 'Brouillon'}
                </span>
                <span class="text-sm text-gray-500">${post.category || 'Sans catégorie'}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">${post.title}</h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">${post.excerpt || ''}</p>
              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span><i class="fas fa-user mr-1"></i>${post.author || 'Anonyme'}</span>
                <span><i class="fas fa-calendar mr-1"></i>${post.created_at ? new Date(post.created_at).toLocaleDateString('fr-FR') : ''}</span>
              </div>
              <div class="flex space-x-2">
                <button class="editPostBtn flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition" data-id="${post.id}">
                  <i class="fas fa-edit mr-2"></i>Modifier
                </button>
                <button class="deletePostBtn bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition" data-id="${post.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${posts.length === 0 ? '<div class="text-center py-12 text-gray-500"><i class="fas fa-inbox text-4xl mb-4"></i><p>Aucun article trouvé</p></div>' : ''}
    `;
    
    document.getElementById('addPostBtn')?.addEventListener('click', () => this.showBlogModal());
    document.querySelectorAll('.editPostBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const post = posts.find(p => p.id == id);
        this.showBlogModal(post);
      });
    });
    document.querySelectorAll('.deletePostBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
          await axios.delete(`/api/blog/admin/${id}`);
          this.loadBlog();
        }
      });
    });
  },
  
  showBlogModal: function(post = null) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">${post ? 'Modifier' : 'Nouvel'} article</h2>
        <form id="postForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input type="text" name="title" value="${post?.title || ''}" required
                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Slug (URL) *</label>
              <input type="text" name="slug" value="${post?.slug || ''}" required
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <input type="text" name="category" value="${post?.category || ''}"
                     class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Auteur</label>
            <input type="text" name="author" value="${post?.author || ''}"
                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Extrait</label>
            <textarea name="excerpt" rows="2" 
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">${post?.excerpt || ''}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
            <textarea name="content" rows="10" required
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">${post?.content || ''}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL Image</label>
            <input type="url" name="image_url" value="${post?.image_url || ''}"
                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600">
          </div>
          
          <div>
            <label class="flex items-center space-x-2">
              <input type="checkbox" name="is_published" ${post?.is_published ? 'checked' : ''} class="rounded">
              <span class="text-sm font-medium text-gray-700">Publier l'article</span>
            </label>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button type="submit" class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition">
              ${post ? 'Mettre à jour' : 'Publier'}
            </button>
            <button type="button" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition" onclick="this.closest('.fixed').remove()">
              Annuler
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('postForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        title: formData.get('title'),
        slug: formData.get('slug'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        author: formData.get('author'),
        category: formData.get('category'),
        image_url: formData.get('image_url'),
        is_published: formData.get('is_published') ? 1 : 0
      };
      
      try {
        if (post) {
          await axios.put(`/api/blog/admin/${post.id}`, data);
        } else {
          await axios.post('/api/blog/admin', data);
        }
        modal.remove();
        this.loadBlog();
      } catch (error) {
        alert('Erreur: ' + (error.response?.data?.error || 'Erreur inconnue'));
      }
    });
  },
  
  loadMessages: async function() {
    const response = await axios.get('/api/contact/admin/all');
    const messages = response.data.messages || [];
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
      <div class="space-y-4">
        ${messages.map(msg => `
          <div class="bg-white rounded-xl shadow-md p-6 ${!msg.is_read ? 'border-l-4 border-purple-600' : ''}">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-bold text-gray-800">${msg.name}</h3>
                  ${!msg.is_read ? '<span class="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">Nouveau</span>' : ''}
                </div>
                <p class="text-sm text-gray-600">
                  <i class="fas fa-envelope mr-2"></i>${msg.email}
                  ${msg.phone ? `<span class="ml-4"><i class="fas fa-phone mr-2"></i>${msg.phone}</span>` : ''}
                </p>
                ${msg.subject ? `<p class="text-sm font-medium text-gray-700 mt-2">Sujet: ${msg.subject}</p>` : ''}
              </div>
              <span class="text-xs text-gray-500">${new Date(msg.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <p class="text-gray-700 mb-4">${msg.message}</p>
            <div class="flex space-x-2">
              ${!msg.is_read ? `
                <button class="markReadBtn bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition" data-id="${msg.id}">
                  <i class="fas fa-check mr-2"></i>Marquer comme lu
                </button>
              ` : ''}
              <button class="deleteMessageBtn bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition" data-id="${msg.id}">
                <i class="fas fa-trash mr-2"></i>Supprimer
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${messages.length === 0 ? '<div class="text-center py-12 text-gray-500"><i class="fas fa-inbox text-4xl mb-4"></i><p>Aucun message trouvé</p></div>' : ''}
    `;
    
    document.querySelectorAll('.markReadBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        await axios.put(`/api/contact/admin/${id}/read`);
        this.loadMessages();
      });
    });
    
    document.querySelectorAll('.deleteMessageBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
          await axios.delete(`/api/contact/admin/${id}`);
          this.loadMessages();
        }
      });
    });
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
