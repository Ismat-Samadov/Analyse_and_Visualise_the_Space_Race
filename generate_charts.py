import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Set style for professional business charts
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.size'] = 10

# Load data
print("Loading dataset...")
df = pd.read_csv('mission_launches.csv')

# Data preparation
print("Preparing data for analysis...")
df['Date'] = pd.to_datetime(df['Date'], format='%a %b %d, %Y %H:%M UTC', errors='coerce')
df['Year'] = df['Date'].dt.year
df['Decade'] = (df['Year'] // 10) * 10
df['Success'] = df['Mission_Status'].apply(lambda x: 1 if x == 'Success' else 0)
df['Price'] = pd.to_numeric(df['Price'], errors='coerce')

# Extract country from location
def extract_country(location):
    if pd.isna(location):
        return 'Unknown'
    parts = location.split(',')
    return parts[-1].strip() if parts else 'Unknown'

df['Country'] = df['Location'].apply(extract_country)

# Clean organization names for better readability
df['Organisation_Clean'] = df['Organisation'].fillna('Unknown')

print("Generating visualizations...\n")

# 1. Launch Volume Trends Over Time
print("1. Creating launch volume trends chart...")
yearly_launches = df.groupby('Year').size().reset_index(name='Launches')
plt.figure(figsize=(14, 6))
plt.plot(yearly_launches['Year'], yearly_launches['Launches'], linewidth=2, color='#2E86AB')
plt.fill_between(yearly_launches['Year'], yearly_launches['Launches'], alpha=0.3, color='#2E86AB')
plt.title('Space Launch Activity Over Time (1957-2020)', fontsize=16, fontweight='bold', pad=20)
plt.xlabel('Year', fontsize=12)
plt.ylabel('Number of Launches', fontsize=12)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('charts/01_launch_volume_trends.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. Top 15 Organizations by Launch Volume
print("2. Creating top organizations chart...")
org_launches = df['Organisation_Clean'].value_counts().head(15)
plt.figure(figsize=(12, 8))
colors = sns.color_palette("viridis", len(org_launches))
bars = plt.barh(range(len(org_launches)), org_launches.values, color=colors)
plt.yticks(range(len(org_launches)), org_launches.index)
plt.xlabel('Total Launches', fontsize=12)
plt.title('Top 15 Organizations by Total Launches (1957-2020)', fontsize=16, fontweight='bold', pad=20)
plt.gca().invert_yaxis()
for i, v in enumerate(org_launches.values):
    plt.text(v + 10, i, str(v), va='center', fontsize=10)
plt.tight_layout()
plt.savefig('charts/02_top_organizations.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. Success Rates by Top Organizations (min 20 launches)
print("3. Creating success rates by organization chart...")
org_stats = df.groupby('Organisation_Clean').agg({
    'Success': ['sum', 'count', 'mean']
}).reset_index()
org_stats.columns = ['Organisation', 'Successes', 'Total', 'Success_Rate']
org_stats = org_stats[org_stats['Total'] >= 20].sort_values('Success_Rate', ascending=True).tail(15)

plt.figure(figsize=(12, 8))
colors_success = ['#27AE60' if x >= 0.9 else '#F39C12' if x >= 0.8 else '#E74C3C'
                  for x in org_stats['Success_Rate']]
bars = plt.barh(range(len(org_stats)), org_stats['Success_Rate'] * 100, color=colors_success)
plt.yticks(range(len(org_stats)), org_stats['Organisation'])
plt.xlabel('Success Rate (%)', fontsize=12)
plt.title('Mission Success Rates by Organization (Min. 20 Launches)', fontsize=16, fontweight='bold', pad=20)
plt.xlim(0, 105)
for i, (rate, total) in enumerate(zip(org_stats['Success_Rate'] * 100, org_stats['Total'])):
    plt.text(rate + 1, i, f'{rate:.1f}% (n={int(total)})', va='center', fontsize=9)
plt.axvline(x=90, color='gray', linestyle='--', alpha=0.5, label='90% threshold')
plt.legend()
plt.tight_layout()
plt.savefig('charts/03_success_rates_by_org.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. Success Rate Evolution Over Decades
print("4. Creating success rate evolution chart...")
decade_success = df.groupby('Decade').agg({
    'Success': 'mean',
    'Year': 'count'
}).reset_index()
decade_success.columns = ['Decade', 'Success_Rate', 'Total_Launches']
decade_success = decade_success[decade_success['Decade'] >= 1950]

fig, ax1 = plt.subplots(figsize=(14, 6))
color1 = '#2E86AB'
ax1.plot(decade_success['Decade'], decade_success['Success_Rate'] * 100,
         marker='o', linewidth=3, color=color1, markersize=8)
ax1.set_xlabel('Decade', fontsize=12)
ax1.set_ylabel('Success Rate (%)', fontsize=12, color=color1)
ax1.tick_params(axis='y', labelcolor=color1)
ax1.set_ylim(0, 105)
ax1.grid(True, alpha=0.3)

ax2 = ax1.twinx()
color2 = '#A23B72'
ax2.bar(decade_success['Decade'], decade_success['Total_Launches'],
        alpha=0.3, color=color2, width=8, label='Total Launches')
ax2.set_ylabel('Total Launches', fontsize=12, color=color2)
ax2.tick_params(axis='y', labelcolor=color2)

plt.title('Mission Success Rate and Launch Volume by Decade', fontsize=16, fontweight='bold', pad=20)
fig.tight_layout()
plt.savefig('charts/04_success_rate_evolution.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. Average Launch Costs by Organization (where price data available)
print("5. Creating average costs by organization chart...")
price_data = df[df['Price'].notna() & (df['Price'] > 0)]
org_prices = price_data.groupby('Organisation_Clean').agg({
    'Price': ['mean', 'count']
}).reset_index()
org_prices.columns = ['Organisation', 'Avg_Price', 'Count']
org_prices = org_prices[org_prices['Count'] >= 5].sort_values('Avg_Price', ascending=True).tail(12)

plt.figure(figsize=(12, 7))
colors_price = sns.color_palette("rocket", len(org_prices))
bars = plt.barh(range(len(org_prices)), org_prices['Avg_Price'], color=colors_price)
plt.yticks(range(len(org_prices)), org_prices['Organisation'])
plt.xlabel('Average Launch Cost (Million USD)', fontsize=12)
plt.title('Average Launch Costs by Organization (Min. 5 Priced Launches)', fontsize=16, fontweight='bold', pad=20)
for i, (price, count) in enumerate(zip(org_prices['Avg_Price'], org_prices['Count'])):
    plt.text(price + 2, i, f'${price:.1f}M (n={int(count)})', va='center', fontsize=9)
plt.tight_layout()
plt.savefig('charts/05_avg_costs_by_org.png', dpi=300, bbox_inches='tight')
plt.close()

# 6. Launch Activity by Decade
print("6. Creating launch activity by decade chart...")
decade_launches = df.groupby('Decade').size().reset_index(name='Launches')
decade_launches = decade_launches[decade_launches['Decade'] >= 1950]

plt.figure(figsize=(12, 6))
colors_decade = sns.color_palette("mako", len(decade_launches))
bars = plt.bar(decade_launches['Decade'], decade_launches['Launches'],
               width=7, color=colors_decade, edgecolor='black', linewidth=1.5)
plt.xlabel('Decade', fontsize=12)
plt.ylabel('Total Launches', fontsize=12)
plt.title('Space Launch Volume by Decade', fontsize=16, fontweight='bold', pad=20)
for i, (decade, launches) in enumerate(zip(decade_launches['Decade'], decade_launches['Launches'])):
    plt.text(decade, launches + 20, str(launches), ha='center', fontsize=11, fontweight='bold')
plt.tight_layout()
plt.savefig('charts/06_launches_by_decade.png', dpi=300, bbox_inches='tight')
plt.close()

# 7. Top Launch Countries/Regions
print("7. Creating top countries chart...")
country_launches = df['Country'].value_counts().head(12)
plt.figure(figsize=(12, 7))
colors_country = sns.color_palette("tab10", len(country_launches))
bars = plt.barh(range(len(country_launches)), country_launches.values, color=colors_country)
plt.yticks(range(len(country_launches)), country_launches.index)
plt.xlabel('Total Launches', fontsize=12)
plt.title('Top 12 Countries by Launch Activity', fontsize=16, fontweight='bold', pad=20)
plt.gca().invert_yaxis()
for i, v in enumerate(country_launches.values):
    plt.text(v + 15, i, str(v), va='center', fontsize=10)
plt.tight_layout()
plt.savefig('charts/07_top_countries.png', dpi=300, bbox_inches='tight')
plt.close()

# 8. Success vs Failure Distribution by Year (Recent 20 years)
print("8. Creating success vs failure trends chart...")
recent_years = df[df['Year'] >= 2000].copy()
outcome_by_year = recent_years.groupby(['Year', 'Mission_Status']).size().unstack(fill_value=0)

if 'Success' not in outcome_by_year.columns:
    outcome_by_year['Success'] = 0
if 'Failure' not in outcome_by_year.columns:
    outcome_by_year['Failure'] = 0
if 'Partial Failure' in outcome_by_year.columns:
    outcome_by_year['Failure'] += outcome_by_year['Partial Failure']

outcome_by_year = outcome_by_year[['Success', 'Failure']]

plt.figure(figsize=(14, 6))
outcome_by_year.plot(kind='bar', stacked=True, color=['#27AE60', '#E74C3C'],
                     ax=plt.gca(), width=0.8)
plt.xlabel('Year', fontsize=12)
plt.ylabel('Number of Launches', fontsize=12)
plt.title('Mission Outcomes Over Time (2000-2020)', fontsize=16, fontweight='bold', pad=20)
plt.legend(title='Outcome', fontsize=11)
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('charts/08_success_vs_failure_trends.png', dpi=300, bbox_inches='tight')
plt.close()

# 9. Price Trends Over Time
print("9. Creating price trends over time chart...")
price_by_year = df[df['Price'].notna() & (df['Price'] > 0) & (df['Year'] >= 1990)].groupby('Year').agg({
    'Price': ['mean', 'median', 'count']
}).reset_index()
price_by_year.columns = ['Year', 'Mean_Price', 'Median_Price', 'Count']

fig, ax1 = plt.subplots(figsize=(14, 6))
ax1.plot(price_by_year['Year'], price_by_year['Mean_Price'],
         marker='o', linewidth=2, color='#E74C3C', label='Average Price', markersize=6)
ax1.plot(price_by_year['Year'], price_by_year['Median_Price'],
         marker='s', linewidth=2, color='#3498DB', label='Median Price', markersize=6)
ax1.set_xlabel('Year', fontsize=12)
ax1.set_ylabel('Launch Cost (Million USD)', fontsize=12)
ax1.legend(loc='upper left', fontsize=11)
ax1.grid(True, alpha=0.3)

plt.title('Launch Cost Trends (1990-2020)', fontsize=16, fontweight='bold', pad=20)
plt.tight_layout()
plt.savefig('charts/09_price_trends.png', dpi=300, bbox_inches='tight')
plt.close()

# 10. Market Share Evolution (Top 5 Organizations, 5-year periods since 2000)
print("10. Creating market share evolution chart...")
df_recent = df[df['Year'] >= 2000].copy()
df_recent['Period'] = (df_recent['Year'] // 5) * 5

top_orgs = df_recent['Organisation_Clean'].value_counts().head(5).index
df_recent_top = df_recent[df_recent['Organisation_Clean'].isin(top_orgs)]

market_share = df_recent_top.groupby(['Period', 'Organisation_Clean']).size().unstack(fill_value=0)
market_share_pct = market_share.div(market_share.sum(axis=1), axis=0) * 100

plt.figure(figsize=(14, 7))
market_share_pct.plot(kind='bar', stacked=True, ax=plt.gca(),
                      colormap='tab10', width=0.7, edgecolor='black', linewidth=0.5)
plt.xlabel('5-Year Period', fontsize=12)
plt.ylabel('Market Share (%)', fontsize=12)
plt.title('Market Share Evolution of Top 5 Organizations (2000-2020)', fontsize=16, fontweight='bold', pad=20)
plt.legend(title='Organization', bbox_to_anchor=(1.05, 1), loc='upper left', fontsize=10)
plt.xticks(rotation=45)
plt.ylim(0, 100)
plt.tight_layout()
plt.savefig('charts/10_market_share_evolution.png', dpi=300, bbox_inches='tight')
plt.close()

# 11. Success Rate by Price Range
print("11. Creating success rate by price range chart...")
price_df = df[df['Price'].notna() & (df['Price'] > 0)].copy()
price_df['Price_Range'] = pd.cut(price_df['Price'],
                                  bins=[0, 30, 60, 90, 150, 1000],
                                  labels=['<$30M', '$30-60M', '$60-90M', '$90-150M', '>$150M'])

price_success = price_df.groupby('Price_Range').agg({
    'Success': ['mean', 'count']
}).reset_index()
price_success.columns = ['Price_Range', 'Success_Rate', 'Count']

plt.figure(figsize=(12, 6))
colors_range = ['#E74C3C' if x < 0.85 else '#F39C12' if x < 0.92 else '#27AE60'
                for x in price_success['Success_Rate']]
bars = plt.bar(range(len(price_success)), price_success['Success_Rate'] * 100,
               color=colors_range, edgecolor='black', linewidth=1.5)
plt.xticks(range(len(price_success)), price_success['Price_Range'])
plt.ylabel('Success Rate (%)', fontsize=12)
plt.xlabel('Price Range', fontsize=12)
plt.title('Mission Success Rate by Launch Cost Range', fontsize=16, fontweight='bold', pad=20)
plt.ylim(0, 105)
for i, (rate, count) in enumerate(zip(price_success['Success_Rate'] * 100, price_success['Count'])):
    plt.text(i, rate + 1.5, f'{rate:.1f}%\n(n={int(count)})', ha='center', fontsize=10)
plt.axhline(y=90, color='gray', linestyle='--', alpha=0.5)
plt.tight_layout()
plt.savefig('charts/11_success_by_price_range.png', dpi=300, bbox_inches='tight')
plt.close()

# 12. Commercial Space Era - Recent Activity (2015-2020)
print("12. Creating recent commercial activity chart...")
commercial_era = df[df['Year'] >= 2015].copy()
top_recent_orgs = commercial_era['Organisation_Clean'].value_counts().head(10)

plt.figure(figsize=(12, 7))
colors_commercial = sns.color_palette("coolwarm", len(top_recent_orgs))
bars = plt.barh(range(len(top_recent_orgs)), top_recent_orgs.values, color=colors_commercial)
plt.yticks(range(len(top_recent_orgs)), top_recent_orgs.index)
plt.xlabel('Number of Launches', fontsize=12)
plt.title('Top 10 Organizations in Commercial Space Era (2015-2020)', fontsize=16, fontweight='bold', pad=20)
plt.gca().invert_yaxis()
for i, v in enumerate(top_recent_orgs.values):
    plt.text(v + 1, i, str(v), va='center', fontsize=10, fontweight='bold')
plt.tight_layout()
plt.savefig('charts/12_commercial_era_leaders.png', dpi=300, bbox_inches='tight')
plt.close()

print("\n" + "="*60)
print("SUCCESS: All 12 charts generated in 'charts/' directory")
print("="*60)
print("\nGenerated charts:")
print("  1. Launch volume trends over time")
print("  2. Top 15 organizations by total launches")
print("  3. Success rates by organization")
print("  4. Success rate evolution by decade")
print("  5. Average costs by organization")
print("  6. Launches by decade")
print("  7. Top countries by launch activity")
print("  8. Success vs failure trends (2000-2020)")
print("  9. Price trends over time")
print(" 10. Market share evolution")
print(" 11. Success rate by price range")
print(" 12. Commercial era leaders (2015-2020)")
