<?php
/**
 * Footer Widgets Template Part
 *
 */
?>

<div class="footer-widget-section">
    <div class="container">
        <div class="widget-columns">
            <div class="widget-column services-column">
                <h3>Services</h3>
                <ul>
                    <li><a href="#">Service 1</a></li>
                    <li><a href="#">Service 2</a></li>
                    <li><a href="#">Service 3</a></li>
                </ul>
            </div>
            <div class="widget-column company-column">
                <h3>Company</h3>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Our Work</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
            <div class="widget-column blog-column">
                <h3>From Our Blog</h3>
                <ul>
                    <li><a href="#">Blog Post 1</a></li>
                    <li><a href="#">Blog Post 2</a></li>
                    <li><a href="#">Blog Post 3</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
.footer-widget-section {
    background-color: #101827;
    color: #ffffff;
    padding: 60px 0;
}

.widget-columns {
    display: flex;
    justify-content: space-around;
    gap: 40px;
}

.widget-column {
    width: calc(33.33% - 20px);
}

.widget-column h3 {
    font-size: 1.4rem;
    margin-bottom: 20px;
}

.widget-column ul {
    list-style-type: none;
    padding: 0;
}

.widget-column li {
    margin-bottom: 10px;
}

.widget-column a {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.3s ease;
}

.widget-column a:hover {
    color: #2563eb;
}
</style>
