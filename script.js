document.addEventListener('DOMContentLoaded', () => {
    // Dashboard Management
    const dashboards = {
        bio: document.querySelector('.bio-dashboard'),
        compeng: document.querySelector('.compeng-dashboard')
    };

    // Tab Switching Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.dashboard;
            
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch dashboards
            Object.values(dashboards).forEach(d => d.classList.remove('active'));
            dashboards[target].classList.add('active');
            
            // Reinitialize components for new dashboard
            initializeDashboard();
        });
    });

    // Main Initialization Function
    function initializeDashboard() {
        const activeDashboard = document.querySelector('.dashboard-container.active');
        const infoCards = activeDashboard.querySelectorAll('.info-card');
        const navItems = activeDashboard.querySelectorAll('.nav-item');
        const stats = activeDashboard.querySelectorAll('.stat-number');

        // 3D Card Hover Effect
        infoCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${(y - rect.height/2) / 10}deg)
                    rotateY(${-(x - rect.width/2) / 10}deg)
                    scale(1.02)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });

        // Card Click Interactions
        infoCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Handle drive cards
                if(card.classList.contains('drive-card')) {
                    window.open(card.querySelector('a').href, '_blank');
                    return;
                }

                // Toggle expansion
                if(!e.target.closest('a')) {
                    card.classList.toggle('expanded');
                    infoCards.forEach(other => {
                        if(other !== card) other.classList.remove('expanded');
                    });
                }
            });
        });

        // Navigation Filtering
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Filter cards based on category
                const category = item.textContent;
                const cardGroups = {
                    bio: {
                        'Research Skills': ['Genomic Literature', 'Data Interpretation'],
                        'Medical Knowledge': ['Pharmacology Updates', 'Neuroanatomy'],
                        'Case Studies': ['Pathogen Studies', 'Lab Techniques']
                    },
                    compeng: {
                        'Hardware Design': ['Computer Architecture', 'Embedded Systems'],
                        'Software Systems': ['Cybersecurity'],
                        'Networking': ['Network Security']
                    }
                };

                const dashboardType = activeDashboard.classList.contains('bio-dashboard') ? 'bio' : 'compeng';
                
                infoCards.forEach(card => {
                    const cardTitle = card.querySelector('h3').textContent;
                    const isVisible = cardGroups[dashboardType][category]?.includes(cardTitle);
                    card.style.display = isVisible ? 'block' : 'none';
                    card.classList.remove('expanded');
                });
            });
        });

        // Animated Statistics
        const increments = activeDashboard.classList.contains('bio-dashboard') 
            ? [73, 2.8, 89] 
            : [85, 3.1, 92];

        stats.forEach((stat, index) => {
            let current = 0;
            const target = increments[index];
            const increment = target / 50;

            const updateCounter = () => {
                if(current < target) {
                    current += increment;
                    stat.textContent = 
                        index === 1 ? 
                        `${current.toFixed(1)}x` : 
                        `${Math.round(current)}%`;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = 
                        index === 1 ? 
                        `${target.toFixed(1)}x` : 
                        `${target}%`;
                }
            }
            updateCounter();
        });
    }

    // Initial Setup
    initializeDashboard();

    // Parallax Effect for Appreciation Card
    const appreciationCard = document.querySelector('.appreciation-card');
    if(appreciationCard) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth/2 - e.pageX)/25;
            const yAxis = (window.innerHeight/2 - e.pageY)/25;
            appreciationCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }
});