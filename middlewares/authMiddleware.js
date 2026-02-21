const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// ✅ Vérifier que l'utilisateur est connecté
exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Extraire le token du header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // Vérifier si le token existe
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Non autorisé - Pas de token' 
            });
        }
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded hia id /role..
        
        // Récupérer l'user complet depuis la DB
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Utilisateur non trouvé' 
            });
        }
        
        // Ajouter l'user COMPLET à req (avec entrepriseId)
        req.user = {
            id: user._id,
            role: user.role,
            entrepriseId: user.entrepriseId,  // ← MAINTENANT disponible !
            departement: user.departement
        };
        
        next();
        
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Token invalide ou expiré' 
        });
    }
};

// Vérifier le rôle de l'utilisateur
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: `Accès refusé - Role ${req.user.role} non autorisé` 
            });
        }
        next();
    };
};