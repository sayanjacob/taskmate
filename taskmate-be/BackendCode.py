import random
from flask import Flask, request, jsonify, session
from flask_session import Session
import mysql.connector
from flask_cors import CORS
from flask_mail import Mail, Message
import stripe

app = Flask(__name__)
CORS(app)
app.secret_key = 'loginsecret'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
Session(app)
 
# MySQL Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'ecom-db',
}
mysql = mysql.connector.connect(**db_config)
#-----------------------------------------------------------------------------------------------------------------



# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'adhwaithk1999@gmail.com'  # replace with your Gmail email
app.config['MAIL_PASSWORD'] = 'wvzu hkor tilj fhky'  # replace with your App Password

mail = Mail(app)

# Placeholder for storing OTPs (In a production environment, use a database)
otp_storage = {}


def generate_otp():
    # Generate a random 6-digit OTP
    return str(random.randint(100000, 999999))


def send_otp_email(email, otp):
    msg = Message('Your OTP for Email Verification', sender='adhwaithk1999@gmail.com', recipients=[email])
    msg.body = f'''
    Thank you for choosing our service. Your One-Time Password (OTP) for email verification is:

    OTP: {otp}

    Please use this OTP within the specified time frame to complete the verification process. 

    If you did not request this OTP or have any concerns, please reach out to our support team immediately.

    We appreciate your trust in us and look forward to serving you.
'''


    try:
        mail.send(msg)
        print(f"OTP sent to {email} via email: {otp}")
        return True, None
    except Exception as e:
        error_message = f"An unexpected error occurred: {e}"
        print(error_message)
        return False, error_message


@app.route('/send-otp-email', methods=['POST'])
def send_otp_email_route():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Generate a random 6-digit OTP
    otp = generate_otp()

    # Store the OTP in the placeholder (In a production environment, use a database)
    otp_storage[email] = otp

    # Send the OTP via email
    success, error_message = send_otp_email(email, otp)

    if success:
        print("sent")
        return jsonify({"message": "OTP sent successfully", "otp": otp}), 200
    else:
        return jsonify({"error": error_message}), 500


@app.route('/verify-otp-email', methods=['POST'])
def verify_otp_email():
    data = request.json
    entered_otp = data.get('otp')

    if not entered_otp:
        return jsonify({"error": "OTP is required"}), 400

    # For simplicity, let's assume there's only one email in the storage
    stored_email = next(iter(otp_storage.keys()), None)
    stored_otp = otp_storage.get(stored_email)

    if stored_otp == entered_otp:
        return jsonify({"message": "OTP verification successful"}), 200
    else:
        return jsonify({"error": "Incorrect OTP"}), 401
#-----------------------------------------------------------------------------------------------------------------
# Set your secret key
stripe.api_key = 'sk_test_51ODnq2SFyl6IAnvdX6BH9RfBWyk1TlHYdm9zkCeAfIaXrV8cSigm2FmpbzSQfzwLShDRAFvNmGYGYqB7zg5vNBsd00ZlYT6cXE'
stripe.api_version = '2020-03-02'  # Use the latest version available
@app.route('/payment/<int:total>',methods=['GET'])
def payment(total):
    try:
        
        # Create a customer with address details
        customer = stripe.Customer.create(
            name='adh',
            address={
                'line1': 'mannur',
                'city': 'kozhikode',
                'state': 'kerals',
                'postal_code': '673012',
                'country': 'IN',
            }
        ) 
        total_amount = int(total)
        # Create a PaymentIntent associated with the customer
        intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency='inr',
            description='TaskMate Service Order',
            customer=customer.id,
        )
        # Return the client_secret to the frontend
        return jsonify({'client_secret': intent.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)})

# ----------------------------------------------------------------------------------------------------------------

#register
@app.route('/register', methods=['POST'])
def register():
    try:
        # fetch data as json
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
 
        cursor = mysql.cursor()
        cursor.execute('INSERT INTO users (name, email, password) VALUES (%s, %s, %s)', (name, email, password))
 
        mysql.commit()
        cursor.close()
 
        return jsonify({"message": "You have successfully registered!"}), 201
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
#login
@app.route('/login', methods=['POST'])
def login():
    try:
        if 'user_id' in session:
            return jsonify({"message": "User is already logged in!"}), 200
 
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
 
        cursor = mysql.cursor()
        cursor.execute('SELECT user_id, email, password, name FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
        cursor.close()
 
        if user and user[2] == password:
            # Store user ID in the session to mark the user as logged in
            session['user_id'] = user[0]
            session['user_name'] = user[3]
            return jsonify({"message": "Logged in successfully!",
            "username":user[3]}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
#logout
@app.route('/logout', methods=['POST'])
def logout():
    try:
        # Check if the user is logged in
        if 'user_id' in session:
            session.pop('user_id', None)
            session.pop('user_name', None)
 
            return jsonify({"message": "Logged out successfully"}), 200
        else:
            return jsonify({"message": "User is not logged in"}), 200
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
#-----------------------------------------------------------------------------------------------------------------

#list all cities
@app.route('/cities', methods=['GET'])
def get_cities():
    cursor = mysql.cursor()
    cursor.execute('SELECT name FROM cities')
    cities = cursor.fetchall()
    cursor.close()
    city_list = [city[0] for city in cities]
    return jsonify({"cities": city_list}), 200
 
#to list city by name
@app.route('/city/<city_name>', methods=['GET'])
def get_city_by_name(city_name):
    cursor = mysql.cursor()
    cursor.execute('SELECT name FROM cities WHERE LOWER(name) = LOWER(%s)', (city_name,))
    city = cursor.fetchone()
    cursor.close()
    if city:
        return jsonify({"city": city[0]}), 200
    else:
        return jsonify({"error": "City not found"}), 404
 
#-----------------------------------------------------------------------------------------------------------------

#services
@app.route('/services/<string:city_name>', methods=['GET'])
def services(city_name):
    try:
        cursor = mysql.cursor(dictionary=True)
        cursor.execute('SELECT s.services_id, s.name, CONCAT(FORMAT(s.discount * 100, 0), "%") AS discount FROM services s JOIN cities c ON s.city_id = c.cities_id WHERE c.name = %s', (city_name,))
        services = cursor.fetchall()
        cursor.close()
        return jsonify({"services": services}), 200
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
#subcategories[services]
@app.route('/service_subcategories/<int:service_id>', methods=['GET'])
def service_subcategories(service_id):
    try:
        # Fetch subcategories using service_id
        cursor = mysql.cursor(dictionary=True)
        cursor.execute('SELECT * FROM subcategories WHERE service_id = %s', (service_id,))
        subcategories_list = cursor.fetchall()
        cursor.close()
        if subcategories_list:
            return jsonify({"subcategories": subcategories_list}), 200
        else:
            return jsonify({"message": "No subcategories found"}), 404
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# add_to_cart[service]
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart_service():
    try:
        data = request.get_json()
        print(data)

        # 
        if 'service_cart' not in session:
            session['service_cart'] = []

        if isinstance(data, list):
             for item in data:
                subcategories_id = item.get('subcategories_id')
                quantity = item.get('quantity')
                name = item.get('name')
                session['service_cart'].append({'subcategories_id': subcategories_id, 'quantity': quantity, 'name': name})
        else:
            subcategories_id = data.get('subcategories_id')
            quantity = data.get('quantity')
            name = data.get('name')
            session['service_cart'].append({'subcategories_id': subcategories_id, 'quantity': quantity, 'name': name})
        return jsonify({"message": "Items added to service cart successfully",
                        "session":session['service_cart']}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# view_cart[service]
@app.route('/view_cart', methods=['GET'])
def view_cart():
    try:
        if 'service_cart' in session:
            cart = session['service_cart'] 
            subcategories_info = []
            cursor = mysql.cursor(dictionary=True)
            for cart_item in cart:
                subcategory_id = cart_item['subcategories_id']
                quantity = cart_item['quantity']
                cursor.execute('SELECT name FROM subcategories WHERE subcategories_id = %s', (subcategory_id,))
                subcategory = cursor.fetchone()
                if subcategory:
                    subcategory_info = {
                        'subcategories_id': subcategory_id,
                        'name': subcategory['name'],
                        'quantity': quantity
                    }
                    subcategories_info.append(subcategory_info)

            cursor.close()
            return jsonify({"cart": subcategories_info}), 200
        else:
            return jsonify({"message": "Service Cart is empty"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# clear_cart[service]
@app.route('/clear_cart_service', methods=['POST'])
def clear_cart_service():
    try:
        if 'service_cart' in session:  
            session['service_cart'] = []  
            return jsonify({"message": "Service Cart cleared successfully"}), 200
        else:
            return jsonify({"message": "Service Cart is already empty"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# delete_cart[service]
@app.route('/delete_cart', methods=['POST'])
def delete_cart():
    try:

        data = request.get_json()
        subcategories_id = str(data.get('subcategories_id'))

        if 'service_cart' in session:  
            cart = session['service_cart']  
            updated_cart = [item for item in cart if str(item['subcategories_id']) != subcategories_id]
            session['service_cart'] = updated_cart  
            session.modified = True
            return jsonify({"message": "Item removed from Service Cart successfully"}), 200
        else:
            return jsonify({"message": "Service Cart is empty"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#---------------------------------------------------------------------------------------------------------------- 
      
#store
@app.route('/store/<string:city_name>', methods=['GET'])
def store(city_name):
    try:
        cursor = mysql.cursor(dictionary=True)
        cursor.execute('SELECT s.store_id, s.name FROM store s JOIN cities c ON s.city_id = c.cities_id WHERE c.name = %s', (city_name,))
        store = cursor.fetchall()
        cursor.close()
        return jsonify({"store": store}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
#store_subcategories
@app.route('/store_subcategories/<int:store_id>', methods=['GET'])
def store_subcategories(store_id):
    try:
        # Fetch subcategories using service_id
        cursor = mysql.cursor(dictionary=True)
        cursor.execute('SELECT * FROM store_subcategories WHERE store_id = %s', (store_id,))
        subcategories_list = cursor.fetchall()
        cursor.close()
        if subcategories_list:
            return jsonify({"subcategories": subcategories_list}), 200
        else:
            return jsonify({"message": "No subcategories found"}), 404
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
#add_cart[store]
@app.route('/add_to_cart_store', methods=['POST'])
def add_to_cart_store():
    try:
        # Get data from the POST request as JSON
        data = request.get_json()
        store_id = data.get('store_id')
        quantity = data.get('quantity', 1)
        name = data.get('name')
        title = data.get('title')

        if 'store_cart' not in session:
            session['store_cart'] = []

        for item in session['store_cart']:
            if item.get('store_id') == store_id and item.get('name') == name and item.get('title') == title:
                item['quantity'] += quantity
                break
        else:
            session['store_cart'].append({'store_id': store_id, 'quantity': quantity, 'name': name, 'title': title})

        session.modified = True  

        return jsonify({"message": "Items added to store cart successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# view_cart[store]
@app.route('/view_cart_store', methods=['GET'])
def view_cart_store():
    try:
        store_cart = session.get('store_cart', [])  
        print(f"Viewing store cart: {store_cart}")

        store_subcategories_info = []
        cursor = mysql.cursor(dictionary=True)

        try:
            for cart_item in store_cart:  
                store_id = cart_item.get('store_id')
                name = cart_item.get('name')
                title = cart_item.get('title')
                if store_id is not None and name is not None and title is not None:
                    quantity = cart_item['quantity']
                    cursor.execute('SELECT * FROM store_subcategories WHERE store_id = %s AND name = %s AND title = %s',
                                   (store_id, name, title))
                    store_subcategory = cursor.fetchone()

                    if store_subcategory:
                        store_subcategory_info = {
                            'store_id': store_id,
                            'name': store_subcategory['name'],
                            'title': store_subcategory['title'],
                            'price': store_subcategory['price'],
                            'quantity': quantity
                        }
                        store_subcategories_info.append(store_subcategory_info)

        finally:
            cursor.close()

        return jsonify({"cart": store_subcategories_info}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# clear_cart[store]
@app.route('/clear_cart_store', methods=['POST'])
def clear_cart_store():
    try:
        if 'store_cart' in session:  
            session['store_cart'] = []  
            return jsonify({"message": "Store Cart cleared successfully"}), 200
        else:
            return jsonify({"message": "Store Cart is already empty"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# delete_store
@app.route('/delete_store', methods=['POST'])
def delete_store():
    try:
   
        data = request.get_json()
        id_delete = data.get('store_id')
        name_delete = data.get('name')
        title_delete = data.get('title')
        if 'store_cart' in session:  
            print(f"Original store cart: {session['store_cart']}")

            session['store_cart'] = [
                item for item in session['store_cart'] if not (
                    item.get('store_id') == id_delete and
                    item.get('name') and item.get('name').lower() == name_delete.lower() and
                    item.get('title') == title_delete
                )
            ]
            session.modified = True  

            print(f"Modified store cart: {session['store_cart']}")

            return jsonify({"message": "Item deleted from Store Cart successfully"}), 200
        else:
            return jsonify({"message": "Store Cart is empty"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#------------------------------------------------------------------------------------------------------------------

#add_review
@app.route('/add_review', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        rating = data.get('rating')
        comment = data.get('comment')

        cursor = mysql.cursor()
        cursor.execute('INSERT INTO reviews (user_id, rating, comment) VALUES (%s, %s, %s)', (user_id, rating, comment))
        mysql.commit()
        cursor.close()

        return jsonify({"message":" Review submitted succesfully"}),200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#view_review
@app.route('/view_review',methods=['GET'] )
def view_review():
    try:
        cursor = mysql.cursor(dictionary= True)
        cursor.execute('SELECT * FROM reviews')
        reviews = cursor.fetchall()
        cursor.close()

        return jsonify({"reviews":reviews}),200
    
    except Exception as e:
        return jsonify({"error": str(e)}),500

#delete_review
@app.route('/delete_review/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        cursor = mysql.cursor()
        cursor.execute('DELETE FROM reviews WHERE review_id = %s', (review_id,))
        mysql.commit()
        cursor.close()
        return jsonify({"message":"Review deleted"}),200
    
    except Exception as e:
        return jsonify({"error":str(e)}),500

# ---------------------------------------------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)