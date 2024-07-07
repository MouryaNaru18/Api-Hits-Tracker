from flask import request

# Example function to extract browser details from user agent
def get_browser_details(user_agent_string):
    from user_agents import parse
    user_agent = parse(user_agent_string)
    return {
        'browser': user_agent.browser.family,
        'browser_version': user_agent.browser.version_string,
        'os': user_agent.os.family,
        'platform': user_agent.platform.family
    }

# Example usage in your log_api_hit function
def log_api_hit(request):
    # ...
    user_agent_info = get_browser_details(request.user_agent.string)
    browser = user_agent_info['browser']
    browser_version = user_agent_info['browser_version']
    os = user_agent_info['os']
    platform = user_agent_info['platform']
    
    # Log detailed user agent info to database
    cur.execute("""
        INSERT INTO api_log (request_id, request_type, request_time, payload, content_type, ip_address, os, user_agent, browser, browser_version, platform)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        request.headers.get('X-Request-Id', 'N/A'),
        request.method,
        datetime.utcnow(),
        request.data.decode('utf-8') if request.data else None,
        request.headers.get('Content-Type', 'N/A'),
        request.remote_addr,
        request.user_agent.platform,
        request.user_agent.string,
        browser,
        browser_version,
        platform
    ))
    # ...
