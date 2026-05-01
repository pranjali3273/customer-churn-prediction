const API_BASE = 'http://127.0.0.1:8000/api';

// Navigation Logic
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            
            e.target.parentElement.classList.add('active');
            const sectionId = e.target.id.replace('nav-', 'section-');
            document.getElementById(sectionId).classList.add('active');
            
            const headerTitle = document.querySelector('.header-title h1');
            if(sectionId === 'section-dashboard') headerTitle.innerText = "Executive Dashboard";
            if(sectionId === 'section-lookup') headerTitle.innerText = "Customer 360 View";
        });
    });

    loadDashboard();
    loadValidCustomerIds();
});

async function loadValidCustomerIds() {
    try {
        const response = await fetch(`${API_BASE}/valid_ids`);
        if (response.ok) {
            const data = await response.json();
            const datalist = document.getElementById("valid-customers");
            data.ids.forEach(id => {
                const option = document.createElement("option");
                option.value = id;
                datalist.appendChild(option);
            });
        }
    } catch (e) {
        console.error("Failed to load valid IDs:", e);
    }
}

// Fetch Insights for Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/insights`);
        const data = await response.json();
        
        document.getElementById('kpi-total').innerText = data.overview.total_customers.toLocaleString();
        document.getElementById('kpi-rate').innerText = data.overview.overall_churn_rate + "%";
        
        let maxCluster = "";
        let maxRate = 0;
        for(const [cluster, rate] of Object.entries(data.by_cluster)) {
            if(rate > maxRate) { maxRate = rate; maxCluster = cluster; }
        }
        document.getElementById('kpi-risk').innerText = `Cluster ${maxCluster} (${maxRate}% Risk)`;
        
        drawChart('segmentChart', 'Avg Churn Risk by Segment', data.by_segment, ['#4F46E5', '#10B981', '#F59E0B', '#EC4899']);
        drawChart('clusterChart', 'Avg Churn Risk by Cluster', data.by_cluster, ['#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6', '#F97316']);
        
    } catch (error) {
        console.error("Error loading dashboard insights:", error);
    }
}

function drawChart(canvasId, title, dataObj, colors) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dataObj),
            datasets: [{
                label: 'Avg Churn Probability (%)',
                data: Object.values(dataObj),
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94A3B8' } },
                x: { grid: { display: false }, ticks: { color: '#94A3B8' } }
            }
        }
    });
}

// Customer Lookup
document.getElementById('btn-search').addEventListener('click', async () => {
    const id = document.getElementById('customer-id-input').value;
    if(!id) return;
    
    try {
        const response = await fetch(`${API_BASE}/customer/${id}`);
        if(!response.ok) {
            alert("Customer not found or dataset not loaded yet.");
            return;
        }
        const data = await response.json();
        const cust = data.customer_details;
        
        document.getElementById('res-id').innerText = cust.customer_id;
        document.getElementById('res-segment').innerText = cust.segment || 'Unknown';
        
        document.getElementById('res-credit').innerText = cust.credit_score || 'N/A';
        document.getElementById('res-city').innerText = cust.city || 'N/A';
        document.getElementById('res-tenure').innerText = cust.tenure_months || 'N/A';
        
        if (cust.avg_monthly_balance_inr_mean) {
            document.getElementById('res-balance').innerText = "₹" + cust.avg_monthly_balance_inr_mean.toLocaleString();
        } else {
            document.getElementById('res-balance').innerText = "N/A";
        }
        
        document.getElementById('res-products').innerText = cust.products_held || 'N/A';
        document.getElementById('res-complaints').innerText = cust.total_complaints || '0';
        
        document.getElementById('res-bal-trend').innerText = cust.balance_trend_slope ? cust.balance_trend_slope.toFixed(2) : 'N/A';
        document.getElementById('res-recency').innerText = cust.recency_ratio ? cust.recency_ratio.toFixed(2) : 'N/A';
        
        document.getElementById('res-rec').innerText = data.recommendation;
        
        const badge = document.getElementById('res-badge');
        badge.className = 'risk-badge';
        if(data.churn_risk_percentage < 30) {
            badge.innerText = `Low Risk (${data.churn_risk_percentage}%)`;
            badge.classList.add('risk-low');
        } else if(data.churn_risk_percentage < 60) {
            badge.innerText = `Medium Risk (${data.churn_risk_percentage}%)`;
            badge.classList.add('risk-medium');
        } else {
            badge.innerText = `High Risk (${data.churn_risk_percentage}%)`;
            badge.classList.add('risk-high');
        }
        
        document.getElementById('lookup-result').classList.remove('hidden');
        
    } catch (error) {
        console.error("Lookup error:", error);
    }
});

// Init
loadDashboard();
